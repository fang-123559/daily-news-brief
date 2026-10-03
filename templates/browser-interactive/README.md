# 每日资讯简报 · 增补三版（V4–V6）

为 [daily-news-brief](https://github.com/fang-123559/daily-news-brief) 新增的三个浏览器交互模板。与项目现有 V1–V3（邮件印刷版）并存：V1–V3 负责「寄出去」，V4–V6 负责「在浏览器里读」。

## 运行方式

零依赖、零网络请求、无 ES Module——**直接双击 `index.html` 即可**（file:// 协议可用）。

也可以起本地服务预览：

```bash
node serve.cjs 8642     # 或 python -m http.server 8642
# 打开 http://127.0.0.1:8642
```

建议桌面端 Chrome / Edge 浏览器，1280×800 及以上。

## 三种读法

| 模板 | 概念 | 手势 | 适合 |
|---|---|---|---|
| **V4 观象台** | 30 条新闻绘成星图：评分=星等（径向+大小），版面=星区，源数=星环（单源为虚环），盘心环带=来源日期构成 | 拖转星盘对准目镜（滚轮/←→可代）；点星读观测记录簿；点盘心环带「只看今晨」 | 扫描式读者 |
| **V5 排字车间** | AI 已抓取、核验、排序——最后一道工序归你：从五格字盘拾字入版（1 头版/3 要闻/4 简讯），拉杆压印出真实排版的成品页（可复制全文、可 window.print） | 点选/拖拽入版 → 拉压杆。可先「让 AI 先排一版」，压印后给出均值与重合度判词（照单全收/大同小异/别有主张/另起炉灶） | 取舍式读者 |
| **V6 手卷** | 一日之事装裱成横向手卷：引首（题签+天气行情）→ 卷首语 → 四版条目（乌丝界栏）→ 卷尾题跋 | 拖拽/滚轮横向展卷；条目钤印（可撤销）；卷尾题跋按真实阅读行为（用时/钤印/集中版面）自动生成，可复制 | 沉浸式读者 |

外壳提供「今日三种读法」选择页、顶部切换轨（键盘 1/2/3）、两套真实数据集切换（2026-08-19 / 2026-09-03，均逐字取自项目 `archives/` 与 `templates/` 数据）。

## 与 build.mjs 的字段兼容

`js/data.js` 由 `sources/gen-data.mjs` 从项目原始 `templates/sample-data.mjs` 与 `templates/data-2026-09-03.mjs` 原样转写，导出字段完全一致：

```
META / PREHEADER / BRIEFING / WEATHER / MARKET_STRIP / SECTIONS / FOOTER_NOTE
item: { no, score, dims{t,i,s,c}, srcCount, main, title, summary, impact, sources[{media,url,date}] }
```

因此未来可以把三个概念转译回邮件安全版（build.mjs 增设 renderV4/5/6，静态降级方案：观象台→规则数据表、排字车间→选编清单、手卷→单列卷式排版），数据无需改动。

## 目录

```
index.html            外壳 + 三个模板的挂载骨架
css/shell.css         外壳与切换轨
css/v4-observatory.css / v5-typeshop.css / v6-handscroll.css
js/data.js            两套真实数据（由 sources/gen-data.mjs 生成）
js/shell.js           编排：读法选择 / 翻纸过渡 / 键盘调度 / 数据集状态
js/v4-observatory.js  星图盘渲染、拖转、记录簿、只看今晨
js/v5-typeshop.js     字盘、版模拖拽、压杆、成品页（打印/复制/AI 对照）
js/v6-handscroll.js   手卷、钤印、题跋生成
serve.cjs             本地预览服务器（可选）
sources/              项目原始数据模块 + 转写脚本
```

## 设计约定

- 三版共用「纸」的物质假设：图纸（制图蓝）/ 木盘铅字 / 宣纸朱砂；无深色模式、无玻璃拟态、无装饰渐变。
- 每版只有一个主手势；压印与钤印是全站仅有的两个「重」动画。
- 颜色、大小、密度全部来自真实字段（score / srcCount / 来源日期 / 版面），没有无据的视觉。
- 全部系统字体；数字经 `NumberAlign`（@font-face local 映射）统一为衬线，延续项目的数字观。
