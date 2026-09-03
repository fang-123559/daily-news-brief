// build.mjs —— 由 sample-data.mjs 生成三版自包含 HTML 邮件模板
// 运行: node templates/build.mjs
// 输出: templates/v1-modern-cards.html / v2-editorial.html / v3-dark-terminal.html
//
// 设计体系(借鉴 yanliudesign/mono-color-skill 的编辑印刷语法):
//   中性纸基材 + 最多两种油墨(各承担明确版角色) + 单一左缘对齐
//   + 25%-55% 主动留白 + 一次 5-12x 的字号跳跃 + 恰好一个手工手势
//   禁止: 卡片网格 / UI 面板 / 胶囊徽章 / 装饰色块 / 居中模板对称
//
// 三版配方:
//   V1 钴蓝规则单页   基材 Neutral White #FAFAF7  墨: 钴蓝 #2148B8(结构) + 碳黑 #1F2328(正文)   手势: 规则数据带
//   V2 薄荷观察日志   基材 Pale Beige   #F5F1E8  墨: 炭黑 #302D2E(正文) + 薄荷绿 #5EB783(批注) 手势: 圈注事实
//   V3 炭红公告       基材 Cool Gray    #E9E9E5  墨: 炭黑 #30343A(主体) + 信号红 #C83232(批注) 手势: 出血红规
//
// 三版共同硬约束: HTML 内必须含 "NumberAlign" 与 "@font-face" 字符串(send_email.ps1 发送前校验)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 用法: node templates/build.mjs [数据模块] [输出文件名前缀]
// 默认: templates/sample-data.mjs,无前缀
const dataArg = process.argv[2];
const outPrefix = process.argv[3] || '';
const D = dataArg ? await import(pathToFileURL(path.join(__dirname, dataArg)).href) : await import('./sample-data.mjs');
const { META, PREHEADER, BRIEFING, WEATHER, MARKET_STRIP, SECTIONS, FOOTER_NOTE = '' } = D;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad2 = (n) => String(n).padStart(2, '0');

const RESET_CSS = `
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; }
body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
a { text-decoration: none; }
`;

const baseHead = (title, extraCss) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<title>${esc(title)}</title>
<style>
/* NumberAlign 数字字体 —— send_email.ps1 硬校验项,勿删 */
@font-face {
  font-family: 'NumberAlign';
  src: local('Times New Roman'), local('Times'), local('Songti SC');
  unicode-range: U+0030-0039, U+002E, U+0025, U+002B, U+002D, U+00B0, U+007E;
}
${RESET_CSS}${extraCss}
</style>
</head>`;

const pageShell = (bg, inner) => `<body style="margin:0;padding:0;background-color:${bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;height:0;">${esc(PREHEADER)}</div>
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:${bg};">
<tr><td class="outer-td" align="center" style="padding:40px 12px;">
<table role="presentation" width="700" border="0" cellpadding="0" cellspacing="0" class="paper" style="width:700px;max-width:700px;background-color:${bg};">
${inner}
</table>
</td></tr>
</table>
</body>
</html>
`;

const READING_NOTE = '本简报由 AI 自动抓取、人工审核生成,内容仅供参考 · 推荐阅读时间约10分钟';
const SOURCES_LINE = '数据来源:WTTR.IN、AQICN、财联社、第一财经、新浪财经、东方财富、金十、REUTERS、AP、BBC、THE GUARDIAN、TECHCRUNCH、THE VERGE、WIRED、CNBC 等';

/* 版式公共件 ------------------------------------------------------------
 * 单一左缘: 全部内容左对齐;分隔只靠细规与留白,不用盒子。
 * 条目解剖: 左缘评分栏(油墨数字) + 内容栏(标题/概况/影响/来源微缩行)
 * ---------------------------------------------------------------------- */
const mkItem = ({ ink, inkDim, display, body, micro, accent, rule }) =>
  function item(it, first, extra = '') {
    return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="${first ? '' : `border-top:1px solid ${rule};`}">
      <tr>
        <td valign="top" style="width:52px;padding:21px 0 0 0;font-family:${display};font-size:12px;font-weight:700;color:${inkDim};letter-spacing:1px;">${pad2(it.no)}</td>
        <td valign="top" style="padding:20px 0 4px 0;">
          <div style="font-family:${display};font-size:16px;font-weight:700;line-height:1.55;color:${ink};">${esc(it.title)}</div>
          <div style="font-family:${body};font-size:13.5px;line-height:1.8;color:${inkDim};margin-top:9px;">${esc(it.summary)}</div>
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;"><tr>
            <td valign="top" style="width:44px;padding-top:2px;font-family:${micro};font-size:9.5px;font-weight:700;letter-spacing:2px;color:${accent};">影响</td>
            <td valign="top" style="font-family:${body};font-size:13px;line-height:1.75;color:${inkDim};">${esc(it.impact)}</td>
          </tr></table>
          ${extra}
          <div style="font-family:${micro};font-size:9.5px;letter-spacing:0.8px;color:${inkDim};opacity:0.75;margin-top:12px;line-height:1.9;">${it.sources
            .map((x) => `<a href="${x.url}" target="_blank" style="color:${accent};border-bottom:1px solid ${accent};">${esc(x.media)}</a><span> ${x.date}</span>`)
            .join('<span>&nbsp;|&nbsp;</span>')}</div>
        </td>
      </tr>
    </table>`;
  };

const mkSectionHead = ({ ink, micro }) =>
  (title, right) => `
    <div style="border-top:1px solid ${ink};padding-top:12px;">
      <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${micro};font-size:14px;font-weight:700;color:${ink};letter-spacing:1px;">${esc(title)}</td>
        <td align="right" class="secr" style="font-family:${micro};font-size:9.5px;letter-spacing:2px;color:${ink};opacity:0.55;">${right}</td>
      </tr></table>
    </div>`;

const mkBriefing = ({ ink, inkDim, display, micro, accent, rule, gesture }) =>
  function briefing() {
    return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
      ${BRIEFING.map((b, i) => `
      <tr>
        <td valign="top" style="width:52px;padding:16px 0 0 0;font-family:${display};font-size:15px;font-weight:700;color:${accent};">${pad2(i + 1)}</td>
        <td valign="top" style="padding:16px 0 14px 0;${i === 0 ? '' : `border-top:1px solid ${rule};`}">
          <div style="font-family:${display};font-size:14.5px;line-height:1.8;color:${inkDim};"><b style="color:${ink};">${esc(b.lead)}</b>:${gesture ? gesture(b) : esc(b.text)}</div>
        </td>
      </tr>`).join('')}
    </table>`;
  };

const mkWeather = ({ ink, inkDim, display, micro, accent, rule }) =>
  function weather() {
    return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr>${['城市', '温度范围', '天气状况', '风向风力', 'AQI · PM2.5'].map((h) => `<td style="font-family:${micro};font-size:9.5px;letter-spacing:1.5px;color:${ink};opacity:0.6;border-bottom:1px solid ${ink};padding:0 10px 8px 0;">${h}</td>`).join('')}</tr>
      ${WEATHER.rows.map((r) => `<tr>
        <td style="font-family:${display};font-size:13.5px;font-weight:700;color:${ink};padding:11px 10px 11px 0;border-bottom:1px solid ${rule};">${esc(r.city)}</td>
        <td style="font-family:${display};font-size:13.5px;color:${inkDim};padding:11px 10px 11px 0;border-bottom:1px solid ${rule};">${esc(r.temp)}</td>
        <td style="font-family:${display};font-size:13.5px;color:${inkDim};padding:11px 10px 11px 0;border-bottom:1px solid ${rule};">${esc(r.desc)}</td>
        <td style="font-family:${display};font-size:13.5px;color:${inkDim};padding:11px 10px 11px 0;border-bottom:1px solid ${rule};">${esc(r.wind)}</td>
        <td style="font-family:${display};font-size:13.5px;color:${inkDim};padding:11px 0;border-bottom:1px solid ${rule};">${esc(r.aqi)}</td>
      </tr>`).join('')}
    </table>
    <div style="font-family:${micro};font-size:11.5px;color:${inkDim};margin-top:14px;line-height:1.8;">提示 — ${esc(WEATHER.note)}</div>`;
  };

const mkFinTable = ({ ink, inkDim, display, micro, accent, rule }) =>
  function finTable() {
    return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:12px;">
      <tr>${SECTIONS[2].table.head.map((h) => `<td style="font-family:${micro};font-size:9.5px;letter-spacing:1.5px;color:${ink};opacity:0.6;border-bottom:1px solid ${ink};padding:0 12px 8px 0;">${h}</td>`).join('')}</tr>
      ${SECTIONS[2].table.rows.map((r) => `<tr>
        <td style="font-family:${display};font-size:13px;color:${inkDim};padding:9px 12px 9px 0;border-bottom:1px solid ${rule};">${esc(r[0])}</td>
        <td style="font-family:${display};font-size:13px;font-weight:700;color:${ink};padding:9px 12px 9px 0;border-bottom:1px solid ${rule};">${esc(r[1])}</td>
        <td style="font-family:${display};font-size:13px;font-weight:700;padding:9px 0;border-bottom:1px solid ${rule};color:${r[2] === null ? inkDim : accent};opacity:${r[2] === null ? 0.6 : 1};">${r[2] === null ? '—' : esc(r[2])}</td>
      </tr>`).join('')}
    </table>
    <div style="font-family:${micro};font-size:9.5px;letter-spacing:0.5px;color:${inkDim};opacity:0.7;margin-top:9px;">${esc(SECTIONS[2].remark)}</div>`;
  };



const mkFooter = ({ ink, micro }) =>
  function footer() {
    return `
    <div style="border-top:1px solid ${ink};margin-top:56px;padding-top:16px;padding-bottom:8px;">
      <div style="font-family:${micro};font-size:9.5px;letter-spacing:1px;color:${ink};opacity:0.6;line-height:2;">${esc(READING_NOTE)}<br>${esc(SOURCES_LINE)}<br><span style="font-weight:700;color:${ink};opacity:0.85;">小柒新闻</span> · DAILY NEWS BRIEF · ${META.dateISO} · ${esc(META.cities)}</div>
    </div>`;
  };

/* 市场数据带(V1/V3 的规则数据手势): 外层两半格,各含 2x2 规则块 */
const mkMarketBand = ({ ink, inkDim, display, micro, accent, rule, halfCls }) =>
  function marketBand(label) {
    const cell = (m) => `
                <td class="mcell" width="50%" valign="top" style="padding:10px 12px 10px 0;border-top:1px solid ${rule};">
                  <div style="font-family:${micro};font-size:9px;letter-spacing:1.5px;color:${inkDim};">${esc(m.name)}</div>
                  <div style="font-family:${display};font-size:16px;font-weight:700;color:${ink};margin-top:4px;white-space:nowrap;">${m.value === null ? '—' : esc(m.value)}${m.unit ? `<span style="font-size:9px;color:${inkDim};font-weight:400;"> ${esc(m.unit)}</span>` : ''}</div>
                  <div style="font-family:${display};font-size:11px;font-weight:700;color:${m.chg === null ? inkDim : accent};opacity:${m.chg === null ? 0.6 : 1};margin-top:2px;">${m.chg === null ? '—' : esc(m.chg)}</div>
                </td>`;
    return `
    <div style="font-family:${micro};font-size:9.5px;letter-spacing:2px;color:${ink};opacity:0.55;">${label}</div>
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;">
      <tr>
        ${[MARKET_STRIP.slice(0, 4), MARKET_STRIP.slice(4)].map((half) => `
        <td class="${halfCls}" width="50%" valign="top" style="padding-right:24px;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
            ${[0, 1].map((row) => `<tr>${half.slice(row * 2, row * 2 + 2).map(cell).join('')}</tr>`).join('')}
          </table>
        </td>`).join('')}
      </tr>
    </table>`;
  };

/* ============================================================
 * V1 钴蓝规则单页 —— ruled information poster
 * 基材 Neutral White #FAFAF7 · 墨: 钴蓝(结构) + 碳黑(正文)
 * 焦点事件: 56px 报头 · 手势: 规则市场数据带
 * ============================================================ */
const renderV1 = () => {
  const sans = "'NumberAlign','Helvetica Neue',Helvetica,Arial,'Microsoft YaHei','PingFang SC',sans-serif";
  const INK = '#2148B8';          // 钴蓝 —— 版式结构: 报头/规则/数字/标签
  const BODY = '#1F2328';         // 碳黑 —— 长文本
  const dim = 'rgba(31,35,40,0.78)';
  const rule = 'rgba(33,72,184,0.30)';
  const micro = sans, display = sans, body = sans, accent = INK;
  const P = { ink: INK, inkDim: dim, display, body, micro, accent, rule };
  const item = mkItem(P), secHead = mkSectionHead(P), briefing = mkBriefing(P);
  const weather = mkWeather(P), finTable = mkFinTable(P);
  const footer = mkFooter(P), marketBand = mkMarketBand({ ...P, halfCls: 'v1-half' });
  const sec = (key, title) => {
    const s = SECTIONS.find((x) => x.key === key);
    return `
    <div style="height:44px;line-height:44px;font-size:0;">&nbsp;</div>
    ${secHead(title || s.name, `${s.items.length} ITEMS`)}
    ${s.items.map((it, i) => item(it, i === 0, key === 'fin' && i === 0 ? finTable() : '')).join('')}
    ${s.remark ? `<div style="font-family:${sans};font-size:9.5px;color:${dim};opacity:0.75;margin-top:16px;letter-spacing:0.5px;line-height:1.8;">${esc(s.remark)}</div>` : ''}`;
  };
  const html = `${baseHead(`${META.title} · ${META.dateCN}`, `
  @media screen and (max-width:650px) {
    .outer-td { padding: 16px 0 !important; }
    .paper { width: 100% !important; }
    .pad { padding: 0 20px !important; }
    .display-h1 { font-size: 38px !important; }
    .v1-half { display: block !important; width: 100% !important; padding-right: 0 !important; }
    .secr { white-space: normal !important; }
  }
`)}
${pageShell('#FAFAF7', `
  <tr><td class="pad" style="padding:0 56px;">
    <div style="font-family:${micro};font-size:9.5px;letter-spacing:3px;color:${INK};opacity:0.6;">小柒新闻 — DAILY NEWS BRIEF — JIAXING · YUHANG</div>
    <div class="display-h1" style="font-family:${display};font-size:56px;font-weight:800;letter-spacing:2px;color:${INK};line-height:1.15;margin-top:14px;">每日资讯简报</div>
    <div style="font-family:${micro};font-size:10.5px;letter-spacing:1.5px;color:${BODY};margin-top:12px;">${META.dateCN} ${META.weekday} &nbsp;·&nbsp; ${esc(META.push)}</div>

    <div style="height:52px;line-height:52px;font-size:0;">&nbsp;</div>
    ${marketBand(`MARKET — ${META.dateISO} · 盘中/延迟`)}

    <div style="height:48px;line-height:48px;font-size:0;">&nbsp;</div>
    ${secHead('今日要点', 'BRIEFING · 5')}
    ${briefing()}

    <div style="height:44px;line-height:44px;font-size:0;">&nbsp;</div>
    ${secHead('天气', `WEATHER · ${WEATHER.source}`)}
    ${weather()}

    ${sec('ai')}
    ${sec('cn')}
    ${sec('fin')}
    ${sec('world')}

    ${footer()}
  </td></tr>
`)}`;
  return html;
};

/* ============================================================
 * V2 薄荷观察日志 —— editorial journal
 * 基材 Pale Beige #F5F1E8 · 墨: 炭黑(正文) + 薄荷绿(批注)
 * 焦点事件: 52px 衬线报头 · 手势: 圈注事实(均为优)
 * ============================================================ */
const renderV2 = () => {
  const serif = "'NumberAlign',Georgia,'Times New Roman','Songti SC',STSong,SimSun,'Noto Serif CJK SC',serif";
  const sans = "'Helvetica Neue',Helvetica,Arial,'Microsoft YaHei','PingFang SC',sans-serif";
  const INK = '#302D2E';          // 炭黑 —— 主体
  const dim = 'rgba(48,45,46,0.82)';
  const rule = 'rgba(48,45,46,0.28)';
  const ACC = '#5EB783';          // 薄荷绿 —— 批注版: 日期/标签/圈注
  const P = { ink: INK, inkDim: dim, display: serif, body: serif, micro: sans, accent: ACC, rule };
  const item = mkItem(P), secHead = mkSectionHead(P), weather = mkWeather(P);
  const finTable = mkFinTable(P), footer = mkFooter(P);
  const sec = (key, title) => {
    const s = SECTIONS.find((x) => x.key === key);
    return `
    <div style="height:48px;line-height:48px;font-size:0;">&nbsp;</div>
    ${secHead(title || s.name, `${s.items.length} ITEMS`)}
    ${s.items.map((it, i) => item(it, i === 0, key === 'fin' && i === 0 ? finTable() : '')).join('')}
    ${s.remark ? `<div style="font-family:${sans};font-size:9.5px;color:${dim};opacity:0.75;margin-top:16px;letter-spacing:0.5px;line-height:1.8;">${esc(s.remark)}</div>` : ''}`;
  };
  const briefing = mkBriefing(P);
  const html = `${baseHead(`${META.title} · ${META.dateCN}`, `
  @media screen and (max-width:650px) {
    .outer-td { padding: 16px 0 !important; }
    .paper { width: 100% !important; }
    .pad { padding: 0 20px !important; }
    .display-h1 { font-size: 34px !important; }
    .secr { white-space: normal !important; }
  }
`)}
${pageShell('#F5F1E8', `
  <tr><td class="pad" style="padding:0 56px;">
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"><tr>
      <td style="font-family:${sans};font-size:9.5px;letter-spacing:3px;color:${INK};opacity:0.55;">小柒新闻 · THE DAILY BRIEFING</td>
      <td align="right" style="font-family:${sans};font-size:9.5px;letter-spacing:2px;color:${ACC};">${esc(META.push)}</td>
    </tr></table>
    <div class="display-h1" style="font-family:${serif};font-size:52px;font-weight:700;color:${INK};line-height:1.2;margin-top:14px;">每日资讯简报</div>
    <div style="font-family:${sans};font-size:10.5px;letter-spacing:1.5px;color:${ACC};margin-top:12px;">${META.dateCN} ${META.weekday} &nbsp;·&nbsp; ${esc(META.cities)}</div>

    <div style="height:52px;line-height:52px;font-size:0;">&nbsp;</div>
    ${secHead('今日要点', 'FIELD NOTES · 5')}
    ${briefing()}

    <div style="height:48px;line-height:48px;font-size:0;">&nbsp;</div>
    ${secHead('天气', `WEATHER · ${WEATHER.source}`)}
    ${weather()}

    ${sec('ai')}
    ${sec('cn')}
    ${sec('fin')}
    ${sec('world')}

    ${footer()}
  </td></tr>
`)}`;
  return html;
};

/* ============================================================
 * V3 炭红公告 —— type-led declaration
 * 基材 Cool Gray #E9E9E5 · 墨: 炭黑(主体) + 信号红(批注)
 * 焦点事件: 84px 日期 · 手势: 出血红规
 * ============================================================ */
const renderV3 = () => {
  const sans = "'NumberAlign','Helvetica Neue',Helvetica,Arial,'Microsoft YaHei','PingFang SC',sans-serif";
  const INK = '#30343A';          // 炭黑 —— 主体
  const dim = 'rgba(48,52,58,0.8)';
  const rule = 'rgba(48,52,58,0.28)';
  const ACC = '#C83232';          // 信号红 —— 批注版: 日期/评分/变动数字
  const P = { ink: INK, inkDim: dim, display: sans, body: sans, micro: sans, accent: ACC, rule };
  const item = mkItem(P), secHead = mkSectionHead(P), briefing = mkBriefing(P);
  const weather = mkWeather(P), finTable = mkFinTable(P);
  const footer = mkFooter(P), marketBand = mkMarketBand({ ...P, halfCls: 'v3-half' });
  const sec = (key, title) => {
    const s = SECTIONS.find((x) => x.key === key);
    return `
    <div style="height:44px;line-height:44px;font-size:0;">&nbsp;</div>
    ${secHead(title || s.name, `${s.items.length} ITEMS`)}
    ${s.items.map((it, i) => item(it, i === 0, key === 'fin' && i === 0 ? finTable() : '')).join('')}
    ${s.remark ? `<div style="font-family:${sans};font-size:9.5px;color:${dim};opacity:0.75;margin-top:16px;letter-spacing:0.5px;line-height:1.8;">${esc(s.remark)}</div>` : ''}`;
  };
  const html = `${baseHead(`${META.title} · ${META.dateCN}`, `
  @media screen and (max-width:650px) {
    .outer-td { padding: 16px 0 !important; }
    .paper { width: 100% !important; }
    .pad { padding: 0 20px !important; }
    .display-date { font-size: 56px !important; }
    .v3-half { display: block !important; width: 100% !important; padding-right: 0 !important; }
    .secr { white-space: normal !important; }
  }
`)}
${pageShell('#E9E9E5', `
  <tr><td class="pad" style="padding:0 56px;">
    <div style="font-family:${sans};font-size:9.5px;letter-spacing:3px;color:${INK};opacity:0.6;">小柒新闻 — 每日资讯简报 — DAILY NEWS BRIEF</div>
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top:10px;"><tr>
      <td valign="bottom">
        <div class="display-date" style="font-family:${sans};font-size:84px;font-weight:800;letter-spacing:1px;color:${ACC};line-height:0.95;">${META.dateISO.slice(5).replace('-', '.')}</div>
      </td>
      <td valign="bottom" style="padding-bottom:6px;">
        <div style="font-family:${sans};font-size:13px;font-weight:700;color:${INK};letter-spacing:1px;line-height:1.7;">${META.dateCN}<br>${META.weekday} · ${esc(META.cities)}</div>
      </td>
    </tr></table>
    <div style="height:3px;background-color:${ACC};width:110%;margin-left:-24px;margin-top:18px;font-size:0;line-height:3px;">&nbsp;</div>

    <div style="height:46px;line-height:46px;font-size:0;">&nbsp;</div>
    ${marketBand(`MARKET — ${META.dateISO} · 盘中/延迟`)}

    <div style="height:44px;line-height:44px;font-size:0;">&nbsp;</div>
    ${secHead('今日要点', 'BRIEFING · 5')}
    ${briefing()}

    <div style="height:44px;line-height:44px;font-size:0;">&nbsp;</div>
    ${secHead('天气', `WEATHER · ${WEATHER.source}`)}
    ${weather()}

    ${sec('ai')}
    ${sec('cn')}
    ${sec('fin')}
    ${sec('world')}

    ${footer()}
  </td></tr>
`)}`;
  return html;
};

/* ---- 输出 ---- */
const banner = (v, name, note) => `<!--
  ${META.title} · ${META.dateCN} ${META.weekday} —— ${v}: ${name}
  设计体系: 借鉴 yanliudesign/mono-color-skill 编辑印刷语法(纸基材/双墨版角色/单一左缘/主动留白/5-12x 字号跳跃/一个手工手势)
  本版配方: ${note}
  数据源: ${dataArg ? 'templates/' + dataArg : 'templates/sample-data.mjs(与 archives/2026-08-19.md 逐字对齐)'}
  发送: powershell -File scripts/send_email.ps1 -SubjectFile <主题文件> -HtmlFile <本文件> -DateStr ${META.dateISO}
  硬校验: 本文件包含 NumberAlign @font-face 定义(send_email.ps1 必需)
  重新生成: node templates/build.mjs
-->
`;

const files = [
  ['v1-modern-cards.html', banner('V1 钴蓝规则单页', 'ruled information poster', '基材 Neutral White #FAFAF7 · 钴蓝 #2148B8(结构) + 碳黑(正文) · 焦点: 56px 报头 · 手势: 规则市场数据带'), renderV1()],
  ['v2-editorial.html', banner('V2 薄荷观察日志', 'editorial journal', '基材 Pale Beige #F5F1E8 · 炭黑 + 薄荷绿 #5EB783(批注) · 焦点: 52px 衬线报头 · 手势: 圈注"均为优"'), renderV2()],
  ['v3-dark-terminal.html', banner('V3 炭红公告', 'type-led declaration', '基材 Cool Gray #E9E9E5 · 炭黑 + 信号红 #C83232(批注) · 焦点: 84px 日期 · 手势: 出血红规'), renderV3()],
];

for (const [name, head, body] of files) {
  const p = path.join(__dirname, outPrefix + name);
  fs.writeFileSync(p, head + body, 'utf8');
  console.log('written:', p, `${(fs.statSync(p).size / 1024).toFixed(1)} KB`);
}
console.log('done.');
