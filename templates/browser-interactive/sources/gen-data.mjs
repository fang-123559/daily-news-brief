// 一次性转换脚本: 将项目原始 sample-data.mjs / data-2026-09-03.mjs 转写为 data.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = async (f) => await import(pathToFileURL(path.join(here, f)).href);

const a = await load('sample-data.mjs');      // 2026-08-19
const b = await load('data-2026-09-03.mjs');  // 2026-09-03

const pack = (m) => ({
  META: m.META,
  PREHEADER: m.PREHEADER,
  BRIEFING: m.BRIEFING,
  WEATHER: m.WEATHER,
  MARKET_STRIP: m.MARKET_STRIP,
  SECTIONS: m.SECTIONS,
  FOOTER_NOTE: m.FOOTER_NOTE,
});

const out = `// data.js —— 由 daily-news-brief/templates/sample-data.mjs(2026-08-19)
// 与 data-2026-09-03.mjs(2026-09-03) 原样转写,字段名与 build.mjs 完全一致。
// 预期数据形状: META/PREHEADER/BRIEFING/WEATHER/MARKET_STRIP/SECTIONS/FOOTER_NOTE
window.NEWS_DATA = ${JSON.stringify({ '2026-08-19': pack(a), '2026-09-03': pack(b) }, null, 1)};
`;
fs.writeFileSync(path.join(here, '..', 'js', 'data.js'), out, 'utf8');
console.log('js/data.js written:', (out.length / 1024).toFixed(1) + 'KB');
