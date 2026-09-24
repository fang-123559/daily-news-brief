// 原版模板渲染器: 读取 archives/email_template.css(仓库最初那套报纸风)
// 用法: node templates/render-classic.mjs <数据模块文件名> <输出html路径>
// 例:   node templates/render-classic.mjs data-2026-09-22.mjs ../archives/2026-09-22.html
// 零第三方依赖; 结构与 CSS 类名完全对应 email_template.css(masthead/dateline/briefing-box/section-kicker/news-item/source-line/data-table/remark-box/footer)

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataArg = process.argv[2];
const outArg = process.argv[3];
if (!dataArg || !outArg) {
  console.error('usage: node templates/render-classic.mjs <data-module.mjs> <out.html>');
  process.exit(2);
}

const dataPath = path.join(__dirname, dataArg);
const css = readFileSync(path.join(__dirname, '..', 'archives', 'email_template.css'), 'utf8');
const mod = await import(pathToFileURL(dataPath).href);
const { META, BRIEFING, WEATHER, SECTIONS, PREHEADER } = mod;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderBriefing = () => `
      <div class="briefing-box">
        <div class="briefing-title">今日要点 · THE BRIEFING</div>
        ${BRIEFING.map((b) => `<div class="briefing-item"><b>${esc(b.lead)}</b>${esc(b.text)}</div>`).join('\n        ')}
      </div>`;

const renderWeather = () => `
      <div class="meta-text">天气预报 · ${esc(META.dateCN)}(${esc(META.weekday)})| ${esc(WEATHER.source)}</div>
      <div class="table-wrap">
        <table class="data-table">
          <tr>${['城市', '温度范围', '天气状况', '风向风力', 'AQI'].map((h) => `<th>${h}</th>`).join('')}</tr>
          ${WEATHER.rows.map((r) => `<tr><td>${esc(r.city)}</td><td>${esc(r.temp)}</td><td>${esc(r.desc)}</td><td>${esc(r.wind)}</td><td>${esc(r.aqi)}</td></tr>`).join('\n          ')}
        </table>
      </div>
      <div class="remark-box">${esc(WEATHER.note)}</div>`;

const renderFinTable = (sec) => {
  if (!sec.table) return '';
  return `
      <div class="table-wrap">
        <table class="data-table">
          <tr>${sec.table.head.map((h) => `<th>${h}</th>`).join('')}</tr>
          ${sec.table.rows.map((r) => `<tr><td>${esc(r[0])}</td><td class="val-up">${esc(r[1])}</td><td>${r[2] === null ? '&mdash;' : /^\+/.test(r[2]) ? `<span class="val-up">${esc(r[2])}</span>` : `<span class="val-down">${esc(r[2])}</span>`}</td></tr>`).join('\n          ')}
        </table>
      </div>
      <div class="remark-box">${esc(sec.remark || '')}</div>`;
};

const renderItem = (it) => {
  const srcLinks = it.sources
    .map((s) => `<a href="${esc(s.url)}">${esc(s.media)}</a>`)
    .join(' &middot; ');
  const srcDates = [...new Set(it.sources.map((s) => s.date))].join(' / ');
  return `
      <div class="news-item">
        <div class="news-headline">${it.no}. ${esc(it.title)}</div>
        <p class="news-body">${esc(it.summary)}</p>
        <p class="news-body"><span class="lead-in">影响</span>${esc(it.impact)}</p>
        <div class="source-line">${srcLinks} &middot; ${esc(srcDates)}</div>
      </div>`;
};

const renderSection = (sec) => `
      <div class="section-kicker">${esc(sec.name)}<span style="float:right;font-weight:600;opacity:0.7">${sec.items.length} 条</span></div>
      ${sec.remark ? `<div class="remark-box">${esc(sec.remark)}</div>` : ''}
      ${sec.table ? renderFinTable(sec) : ''}
      ${sec.items.map(renderItem).join('\n      ')}`;

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(META.title)} · ${esc(META.dateCN)}</title>
${css}
</head>
<body>
<div class="email-wrapper">
<div class="email-container">

      <div class="masthead">
        <div class="masthead-top"></div>
        <h1>小柒新闻</h1>
        <div class="meta-text" style="text-align:center;margin-top:6px;">每日资讯简报 &middot; DAILY NEWS BRIEF${PREHEADER ? ` &middot; ${esc(PREHEADER.slice(0, 40))}` : ''}</div>
      </div>
      <div class="dateline"><span>${esc(META.dateCN)} &middot; ${esc(META.weekday)}</span><span>${esc(META.cities)} &middot; ${esc(META.push)}</span></div>
${renderBriefing()}
${renderWeather()}
${SECTIONS.map(renderSection).join('\n')}

      <div class="footer">
        <p>本简报由 AI 自动抓取、人工审核生成,内容仅供参考 &middot; 推荐阅读时间约 10 分钟</p>
        <p>数据来源:wttr.in、aqicn.org、财联社、新华网、央视网、TechCrunch、The Verge、WIRED、Engadget、上海证券报、腾讯新闻、中国商务部、求是网 等</p>
        <p>小柒新闻 &middot; 每日资讯简报 &middot; ${esc(META.dateCN)}</p>
      </div>

</div>
</div>
</body>
</html>
`;

writeFileSync(outArg, html, 'utf8');
console.log('written: ' + path.resolve(outArg) + ' (' + (html.length / 1024).toFixed(1) + ' KB)');
