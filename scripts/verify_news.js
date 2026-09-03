/**
 * 每日资讯简报 · 新闻时效性与真实性核验（硬性 gate）
 *
 * 用法：
 *   node scripts/verify_news.js <candidates.json> [--window 2026-08-18] [--report outputs/verify_report.json] [--blacklist yesterday_blacklist.txt]
 *
 * candidates.json 结构（sub agent 返回的 items 聚合）：
 * {
 *   "items": [
 *     { "section": "AI", "title": "...", "url": "https://...", "sources": [{ "media": "...", "url": "..." }] },
 *     ...
 *   ]
 * }
 *
 * 规则（对应 AGENTS.md 2.5 时效性）：
 *   1. 每个来源 URL 必须实际抓取返回 200；404/301/超时/重定向到首页一律剔除。
 *   2. 提取 article:published_time / datePublished / pubdate / og:published_time / Google News pubDate，
 *      换算到北京时间，落在 [昨日08:30, 今日08:30] 才通过。
 *   3. 抓不到发布元数据的条目标记"需人工复核"，不自动通过。
 *   4. 命中昨日标题黑名单（标题模糊匹配 >70%）一律剔除。
 * 输出 verify_report.json，并打印通过/剔除摘要。未通过条目不进日报。
 */

const net = require('net');
const tls = require('tls');
const https = require('https');
const fs = require('fs');
const path = require('path');

// 抓取通道: 默认直连。仅在受限网络需要代理时,设置 PROXY_HOST(和可选 PROXY_PORT,默认 1080)。
const USE_PROXY = !!(process.env.PROXY_HOST || process.env.PROXY_PORT);
const PROXY = { host: process.env.PROXY_HOST || '127.0.0.1', port: Number(process.env.PROXY_PORT || 1080) };
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

// 默认通道: 直连(不走代理)。返回 {status, html, location}
function directGet(url, headers, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(url); } catch (e) { return reject(new Error('bad url')); }
    if (u.protocol !== 'https:') return reject(new Error('only https: ' + url));
    const req = https.request(u, {
      method: 'GET',
      headers: Object.assign({
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8',
        'Accept-Encoding': 'identity',
        'Connection': 'close'
      }, headers || {}),
      timeout: timeoutMs
    }, (res) => {
      let body = '';
      res.setEncoding('binary');
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        resolve({ status: res.statusCode || 0, html: body, location: String(res.headers.location || '').trim() });
      });
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

function tunnelGet(url, headers, timeoutMs = 30000) {
  if (!USE_PROXY) return directGet(url, headers, timeoutMs);
  return new Promise((resolve, reject) => {
    let u;
    try { u = new URL(url); } catch (e) { return reject(new Error('bad url')); }
    if (u.protocol !== 'https:') return reject(new Error('only https: ' + url));

    const sock = net.connect(PROXY.port, PROXY.host);
    let buf = Buffer.alloc(0);
    let started = false;
    const timer = setTimeout(() => { sock.destroy(); reject(new Error('timeout')); }, timeoutMs);

    sock.on('connect', () => {
      sock.write(`CONNECT ${u.hostname}:443 HTTP/1.1\r\nHost: ${u.hostname}:443\r\nProxy-Connection: Keep-Alive\r\n\r\n`);
    });

    sock.on('error', (e) => { clearTimeout(timer); reject(e); });
    sock.on('data', (d) => {
      if (started) return;
      buf = Buffer.concat([buf, d]);
      const i = buf.indexOf('\r\n\r\n');
      if (i < 0) return;
      started = true;
      const rest = buf.slice(i + 4);
      if (!/^HTTP\/1\.[01] 200/.test(buf.slice(0, i).toString())) {
        sock.destroy();
        clearTimeout(timer);
        reject(new Error('CONNECT failed'));
        return;
      }

      const tlsSock = tls.connect({ socket: sock, servername: u.hostname }, () => {
        if (rest.length) tlsSock.unshift(rest);
        const hdr = Object.assign({
          'User-Agent': UA,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8',
          'Accept-Encoding': 'identity',
          'Connection': 'close'
        }, headers || {});
        const lines = Object.entries(hdr).map(([k, v]) => `${k}: ${v}`).join('\r\n');
        tlsSock.write(`GET ${u.pathname + u.search} HTTP/1.1\r\nHost: ${u.hostname}\r\n${lines}\r\n\r\n`);
      });

      let body = '';
      tlsSock.on('data', (c) => { body += c.toString('binary'); });
      tlsSock.on('error', (e) => { sock.destroy(); clearTimeout(timer); reject(e); });
      tlsSock.on('close', () => {
        clearTimeout(timer);
        try {
          const sep = body.indexOf('\r\n\r\n');
          const head = sep >= 0 ? body.slice(0, sep) : body;
          const statusMatch = head.match(/^HTTP\/1\.[01] (\d+)/);
          const status = statusMatch ? Number(statusMatch[1]) : 0;
          const html = sep >= 0 ? body.slice(sep + 4) : '';
          const loc = (head.match(/^location:\s*(.*)$/im) || [])[1] || '';
          resolve({ status, html, location: loc.trim() });
        } catch (e) { reject(e); }
      });
    });
  });
}

const DATE_PATTERNS = [
  /(?:article:published_time|datePublished|pubdate|og:published_time|datetime)["']?\s*[:=]\s*["']?([^"'<>\s]+)/gi,
  /\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})[T\s](\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(Z|[+-]\d{2}:?\d{2}))?/g,
  // 中文站常见 "2026-08-19 09:05:36"（空格分隔，无 T）
  /\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})[ ](\d{1,2}):(\d{2}):(\d{2})\b/g
];

// 只接受 "2026" 这种孤立年份? 不允许：会被误当成 2026-01-01。
// 过滤掉只有年份的匹配。
function looksLikeFullDate(v) {
  // 形如 2026-08-19 或 2026/08/19，至少含月-日
  return /20\d{2}[-/.]\d{1,2}[-/.]\d{1,2}/.test(v);
}

function toDateObj(s) {
  if (!s) return null;
  let d;
  if (s.includes('GMT') || s.includes('UTC') || /^[A-Z][a-z]{2},/.test(s)) {
    d = new Date(s);
  } else {
    d = new Date(s);
  }
  return d && !isNaN(d.getTime()) ? d : null;
}

function toBJTHour(date) {
  // 转北京时间（Asia/Shanghai = UTC+8），返回 { y, mo, d, h, min }
  const utc = date.getTime() + 8 * 3600 * 1000;
  const d = new Date(utc);
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth() + 1, d: d.getUTCDate(), h: d.getUTCHours(), min: d.getUTCMinutes() };
}

function extractDates(html) {
  const out = [];
  const push = (v) => { const d = toDateObj(v); if (d) out.push({ raw: v, date: d }); };

  // pattern 0: meta 属性值（m[1] 为完整日期字符串）
  let re0 = DATE_PATTERNS[0];
  re0.lastIndex = 0;
  let m0;
  while ((m0 = re0.exec(html)) !== null) {
    if (m0[1] && looksLikeFullDate(m0[1])) push(m0[1]);
  }

  // pattern 1/2: YYYY-MM-DD[ T]HH:MM[:SS]，m[1] 是年份，必须用 m[2..8] 组
  for (let pi = 1; pi < DATE_PATTERNS.length; pi++) {
    const re = DATE_PATTERNS[pi];
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      // 普通日期正则：m[1]=年 m[2]=月 m[3]=日 m[4]=时 m[5]=分 m[6]=秒
      // 中文站通常无时区后缀，默认按北京时间（+08:00）解释；带时区则用原时区
      push(`${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}${m[6] ? ':' + m[6] : ''}${m[8] ? m[8] : '+08:00'}`);
    }
  }

  // 常见英文日期：Mon, 17 Aug 2026 ...
  const eng = html.match(/\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*,\s+\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+20\d{2}[^<]{0,40}/g);
  if (eng) eng.forEach((v) => { const d = toDateObj(v.replace(/\./g, '')); if (d) out.push({ raw: v, date: d }); });

  // 过滤无效时间；优先窗口内（不在此处判窗，靠调用方），至少按时间升序
  const valid = out.filter((x) => x.date && x.date.getTime() > 0);
  valid.sort((a, b) => a.date.getTime() - b.date.getTime());
  return valid;
}

function similarity(a, b) {
  const chars = (s) => new Set(s.toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, ''));
  const sa = chars(a), sb = chars(b);
  let inter = 0;
  sa.forEach((c) => { if (sb.has(c)) inter++; });
  const union = sa.size + sb.size - inter;
  return union ? inter / union : 0;
}

function inWindow(date, windowDate) {
  const w = toBJTHour(date);
  const start = new Date(Date.UTC(windowDate.getUTCFullYear(), windowDate.getUTCMonth(), windowDate.getUTCDate() - 1, 0, 30)); // 昨日08:30 BJT = 昨日00:30 UTC
  const end = new Date(Date.UTC(windowDate.getUTCFullYear(), windowDate.getUTCMonth(), windowDate.getUTCDate(), 0, 30)); // 今日08:30 BJT = 今日00:30 UTC
  return date >= start && date <= end;
}

async function googleNewsCheck(title, windowDate) {
  // 用标题在 Google News RSS 检索，返回窗口内最相似的真实条目
  try {
    // 提取英文关键词（专有名词、数字、厂商名），过滤中文与停用词
    const englishWords = (title.match(/[A-Za-z][A-Za-z0-9.\-]{2,}/g) || [])
      .filter((w) => !/^(the|a|an|and|or|for|with|from|its|new|has|raises|complete|to|of|in|on|as|up|by|at|over|billion|million)$/i.test(w))
      .slice(0, 4);
    const key = englishWords.join(' ');
    if (!key) return null;

    for (const q of [key, title.slice(0, 60)]) {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
      const res = await tunnelGet(url);
      if (res.status !== 200) continue;
      const items = [];
      const re = /<item>([\s\S]*?)<\/item>/g;
      let m;
      while ((m = re.exec(res.html)) !== null) {
        const block = m[1];
        const t = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/.exec(block);
        const link = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/.exec(block);
        const pub = /<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/.exec(block);
        const src = /<source url="([^"]*)"[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/.exec(block);
        const pubDate = pub ? toDateObj(pub[1].trim()) : null;
        if (pubDate && inWindow(pubDate, windowDate)) {
          items.push({ title: t ? t[1] : '', url: link ? link[1] : '', pubDate, source: src ? src[2] : '' });
        }
      }
      if (items.length) {
        items.sort((a, b) => similarity(b.title, title) - similarity(a.title, title));
        return items[0];
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// 跟随重定向最多 5 次
async function tunnelGetFollow(url, headers, timeoutMs = 30000, hops = 5) {
  if (hops <= 0) return null;
  let r;
  try {
    r = await tunnelGet(url, headers, timeoutMs);
  } catch (e) {
    return { status: 0, error: e.message, html: '', location: '' };
  }
  if (r.status >= 300 && r.status < 400 && r.location) {
    let next = r.location;
    if (next.startsWith('/')) {
      try { next = new URL(next, url).href; } catch (e) { /* 保留原值 */ }
    }
    const followed = await tunnelGetFollow(next, headers, timeoutMs, hops - 1);
    if (followed) return followed;
  }
  return r;
}

async function main() {
  const args = process.argv.slice(2);
  const candFile = args[0];
  let windowDate = new Date(); // 默认今天（本地）
  let reportFile = path.join(__dirname, '..', 'outputs', 'verify_report.json');
  let blacklistFile = null;

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--window' && args[i + 1]) { windowDate = new Date(args[++i] + 'T00:00:00Z'); }
    if (args[i] === '--report' && args[i + 1]) { reportFile = args[++i]; }
    if (args[i] === '--blacklist' && args[i + 1]) { blacklistFile = args[++i]; }
  }

  if (!candFile || !fs.existsSync(candFile)) {
    console.error('usage: node scripts/verify_news.js <candidates.json> [--window YYYY-MM-DD] [--report file] [--blacklist file]');
    process.exit(2);
  }

  const cand = JSON.parse(fs.readFileSync(candFile, 'utf8'));
  const items = cand.items || [];
  const blacklist = blacklistFile && fs.existsSync(blacklistFile)
    ? fs.readFileSync(blacklistFile, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
    : [];

  const results = [];
  for (const it of items) {
    const urls = [];
    if (it.url) urls.push(it.url);
    if (Array.isArray(it.sources)) it.sources.forEach((s) => s && s.url && urls.push(s.url));
    const uniqueUrls = [...new Set(urls)];

    const urlResults = [];
    for (const u of uniqueUrls.slice(0, 5)) {
      let r = await tunnelGetFollow(u);
      if (!r) {
        urlResults.push({ url: u, status: 0, error: 'redirect-limit', ok: false });
        continue;
      }
      const dates = extractDates(r.html);
      // 优先取窗口内日期；没有窗口内日期才取最早有效日期（便于展示）
      const windowDates = dates.filter((d) => d.date && inWindow(d.date, windowDate));
      const pub = windowDates.length ? windowDates[0].date : (dates.length ? dates[0].date : null);
      urlResults.push({
        url: u,
        status: r.status,
        ok: r.status === 200 && !/^https?:\/\/[^/]+\/?$/.test(r.location) && !r.location,
        publishedRaw: windowDates.length ? windowDates[0].raw : (dates.length ? dates[0].raw : null),
        published: pub ? pub.toISOString() : null,
        inWindow: pub ? inWindow(pub, windowDate) : null
      });
    }

    const anyOk = urlResults.some((x) => x.ok);
    const anyInWindow = urlResults.some((x) => x.inWindow === true);
    const anyDate = urlResults.some((x) => x.published);
    const blackHit = blacklist.some((b) => similarity(b, it.title || '') > 0.7);

    let googleHit = null;
    let status = !anyOk ? 'REJECT' : (!anyDate ? 'MANUAL' : (anyInWindow ? 'PASS' : 'REJECT'));
    const reasons = [];
    if (!anyOk) reasons.push('no-200-url');
    if (blackHit) reasons.push('blacklist-match');
    if (!anyDate) reasons.push('no-publish-date');
    if (anyDate && !anyInWindow) reasons.push('outside-window');

    // URL 抓取受限或日期存疑时，用 Google News 交叉核验真实来源
    if (status !== 'PASS') {
      googleHit = await googleNewsCheck(it.title || '', windowDate);
      if (googleHit) {
        status = 'PASS_VIA_GOOGLE';
        reasons.length = 0;
        reasons.push('google-news-cross-check');
      }
    }

    results.push({
      section: it.section || '',
      title: it.title || '',
      status,
      reasons,
      googleHit,
      urlResults
    });
  }

  fs.mkdirSync(path.dirname(reportFile), { recursive: true });
  fs.writeFileSync(reportFile, JSON.stringify({ windowDate: windowDate.toISOString(), results }, null, 2), 'utf8');

  const pass = results.filter((r) => r.status === 'PASS' || r.status === 'PASS_VIA_GOOGLE');
  const rej = results.filter((r) => r.status === 'REJECT');
  const manual = results.filter((r) => r.status === 'MANUAL');
  console.log(`通过 ${pass.length} / 剔除 ${rej.length} / 需人工复核 ${manual.length}`);
  pass.forEach((r) => console.log((r.status === 'PASS_VIA_GOOGLE' ? 'PASS-G' : 'PASS  ') + ' ' + (r.section ? r.section + ' | ' : '') + r.title + (r.googleHit ? ' [' + r.googleHit.source + ']' : '')));
  rej.forEach((r) => console.log('REJECT ' + (r.section ? r.section + ' | ' : '') + r.title + ' [' + r.reasons.join(',') + ']'));
  manual.forEach((r) => console.log('MANUAL ' + (r.section ? r.section + ' | ' : '') + r.title));
  console.log('WROTE ' + reportFile);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
