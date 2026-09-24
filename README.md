# 每日资讯简报 · Daily News Brief

一个由 AI 定时驱动的每日资讯简报自动化项目：每天抓取天气、AI、国内、金融、国际五个板块的最新新闻，多源合并、时效核验、四维打分，生成报纸风格的 HTML 邮件并发送到指定邮箱。

> 本项目用于展示「Codex 自动化 + 多 sub-agent 并行检索 + 硬性核验 gate」的完整工程实现。内容仅作演示，不构成任何投资或决策建议。

## 特性

- 5 个 sub-agent 并行检索：天气 / AI / 国内 / 金融 / 国际
- 多源合并：每条新闻至少 2 个来源（官方公告/独家允许单源）
- 时效性硬性核验 gate：`verify_news.js` 逐条抓取 URL、提取原文发布元数据，确认落在 24h 窗口内才收录
- 跨板块/跨天去重：标题字符集重叠度 > 70% 判重
- 四维打分：时效性 / 重要性 / 来源可信度 / 信息完整度
- 报纸风格 HTML 邮件：masthead 报头 + 衬线排版 + NumberAlign 数字字体
- 全 PowerShell/Node 零第三方依赖

## 📦 安装方法

### 方式一：直接把链接丢给 AI Agent（小白最推荐 🌟）

**什么都不用自己操作**，只需把下面这段话复制给你的 AI 助手（Codex / Claude / WorkBuddy 等），让它自己去下载、安装、配置，再教你怎么用：

> 请帮我把这个 GitHub 仓库的资讯简报项目配置好：
> 仓库：https://github.com/fang-123559/daily-news-brief
> 请先下载（git clone 或下载 ZIP），放到我的本地工作目录，
> 再帮我：1) 按 `config\smtp.env.example` 创建 `config\smtp.env` 并配置邮件；
> 2) 运行 scripts 下的抓取脚本，验证天气 / 金银 / 快讯数据源可用；
> 3) 告诉我怎么用它。

也可以直接让 Agent 执行下面的命令完成下载：

```bash
git clone https://github.com/fang-123559/daily-news-brief.git
```

### 方式二：手动下载（推荐新手）

1. 点击右上角 **Code → Download ZIP** 下载并解压
2. 确认本机满足下方「前置要求」（Windows PowerShell + Node.js）
3. 复制 `config\smtp.env.example` 为 `config\smtp.env`，填入你的 163 邮箱授权码
4. 依次运行 `scripts\` 下的脚本，验证天气 / 金银 / 快讯数据能正常抓取

### 方式三：Git 克隆

```bash
git clone https://github.com/fang-123559/daily-news-brief.git
cd daily-news-brief
```

## 🚀 使用方式

### 方式一：对话中直接触发

配置完成后，在 AI 对话中直接说：

> "帮我生成今天的一份每日资讯简报"

AI 会按 README 流程抓取 5 个板块数据、核验时效、多源合并、生成日报，展示审阅版后等待你确认，再发送邮件。审阅版（含四维打分）只出现在对话与 Markdown 存档中，HTML 邮件不含打分。

### 方式二：接入自动化定时推送（推荐）

在 Codex / Claude / WorkBuddy 等平台创建一个每日定时任务（如每天 08:30），prompt 可参考：

```text
每天生成一份每日资讯简报，严格按 README 的执行流程：
抓取天气/AI/国内/金融/国际数据 → 时效硬核验 → 多源合并 → 生成日报 Markdown → 展示审阅版 → 用户确认后调用 send_email.ps1 发送 HTML 邮件
```

首次使用请先把 `config\smtp.env.example` 复制为 `config\smtp.env` 并填写真实授权码。

## 前置要求

- Windows + PowerShell 5.1+（脚本为 `.ps1`）
- Node.js 18+（运行 `verify_news.js`）
- 一个 163 邮箱的 SMTP 授权码（smtp.163.com:465 SSL）
- 网络可访问天气 / 行情 / 新闻数据源（受限网络下可配置本地代理）

## 目录结构

```text
daily-news-brief/
├── README.md
├── config/
│   ├── smtp.env.example      # 邮箱配置模板（复制为 smtp.env 填写）
│   └── candidates_template.json  # sub-agent 候选 JSON 输出模板
├── scripts/
│   ├── fetch_weather.ps1     # 嘉兴/余杭天气（wttr.in → weather.com.cn 降级）
│   ├── fetch_metals.ps1      # 金银/汇率行情（新浪 + 东方财富）
│   ├── fetch_jin10.ps1       # 金十快讯直抓
│   ├── fetch_cailian.ps1     # 财联社热门直抓
│   ├── verify_news.js        # 时效性/真实性硬性核验
│   └── send_email.ps1        # SMTP HTML 邮件发送（163 隐式 SSL）
├── templates/               # 四版可切换的 HTML 邮件模板(编辑印刷体系)
│   ├── build.mjs            # 蓝图/主笔/开盘生成器: node templates/build.mjs [数据模块] [前缀]
│   ├── render-classic.mjs   # 大报(原版报纸风)渲染器: node templates/render-classic.mjs [数据模块] [输出]
│   ├── sample-data.mjs      # 样例数据(与 archives/2026-08-19.md 对齐)
│   ├── data-2026-09-03.mjs  # 2026-09-03 真实抓取数据示例
│   ├── data-2026-09-22.mjs  # 2026-09-22 真实抓取数据示例
│   ├── README.md            # 四版设计说明与定名(大报/蓝图/主笔/开盘)
│   ├── lanTu.html / zhuBi.html / kaiPan.html            # 三版样例模板
│   └── daily-2026-09-22-lanTu.html 等                    # 当日邮件成品
└── archives/
    ├── email_template.css    # 报纸风格 HTML 邮件模板
    ├── 2026-08-18.md         # 示例日报
    ├── 2026-08-19.md         # 示例日报
    └── 2026-09-03.md         # 示例日报(下午版,含审阅版打分)
```

## 配置与运行

### 1. 配置 SMTP

```powershell
Copy-Item config\smtp.env.example config\smtp.env
# 编辑 config\smtp.env，填入 SMTP_HOST / SMTP_USER / SMTP_PASS / MAIL_TO
```

`send_email.ps1` 默认从仓库根目录下的 `config\smtp.env` 读取配置。

### 2. 抓取数据

```powershell
# 天气（嘉兴 + 余杭）
& scripts\fetch_weather.ps1

# 金银价格
& scripts\fetch_metals.ps1

# 金十 / 财联社快讯
& scripts\fetch_jin10.ps1
& scripts\fetch_cailian.ps1
```

### 3. 核验新闻候选

候选 JSON 格式参见 `config/candidates_template.json`（运行 pipeline 时由 sub-agent 生成）：

```text
node scripts/verify_news.js candidates.json --window 2026-08-19 --report outputs/verify_report.json --blacklist yesterday_blacklist.txt
```

- URL 返回 200 + 原文发布元数据落在 `[昨日 08:30, 今日 08:30]`（北京时间）→ `PASS`
- 直抓反爬（Reuters 401 / Bloomberg 403 等）→ 自动 Google News 交叉核验 → `PASS_VIA_GOOGLE`
- 404 / 301 / 无日期 / 命中昨日黑名单 → `REJECT`

### 4. 发送邮件

```powershell
& scripts\send_email.ps1 -SubjectFile archives\subject.txt -HtmlFile archives\2026-08-19.html -DateStr 2026-08-19
```

SMTP 头部为 ASCII-only，主题用 RFC 2047 编码，HTML 正文用 Base64 + 76 字符折行（RFC 2045），保证中文不乱码。

## 核验脚本说明

`verify_news.js` 是本次实现的重点：它不只是检查 URL 是否 200，还会从页面提取 `article:published_time` / `datePublished` / `pubdate` / `og:published_time` 等发布元数据，换算到北京时间确认在 24h 窗口内；中文站无时区日期默认按北京时间解析。直抓受限时用 Google News RSS 的 `pubDate` 交叉核验，并把来源替换为真实可访问 URL。

抓取通道默认**直连**；受限网络需要代理时，设置环境变量 `PROXY_HOST`（可选 `PROXY_PORT`，默认 1080），脚本自动改走 CONNECT 隧道。

## 免责声明

- 本项目数据来自公开网络，仅供学习与演示，不构成任何投资建议或新闻引用保证。
- 请遵守目标网站的条款与版权要求，合理控制抓取频率。
- `config/smtp.env` 属于敏感配置，已加入 `.gitignore`，请勿提交真实授权码。
