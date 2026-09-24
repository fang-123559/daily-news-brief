// 2026-09-22 午间版 · 真实抓取数据
// 核验报告: outputs/verify_report_2026-09-22.json / verify_report_additions_2026-09-22.json / verify_report_additions2_2026-09-22.json
// 数据来源: scripts/fetch_weather.ps1(wttr.in) + fetch_metals.ps1(新浪) + fetch_cailian.ps1(财联社API含ctime)
//           + 腾讯/新浪财经行情 + aqicn.org + WebFetch 列表(新华网/The Verge/TechCrunch/Wired/Engadget/商务部/求是网)
// 时效窗口: 2026-09-21 08:30 ~ 2026-09-22 08:30(北京时间);行情与天气为抓取时点快照(11:37)
// 核验结果: 42 候选 → 39 PASS,2 REJECT(含1条URL不存在),1 条人工复核(央视救灾稿,URL日期+页面确认)
// 采用条数: AI 10(目标10) · 国内 10(目标10) · 财经 5(目标5) · 国际 6(目标5)

export const META = {
  title: '每日资讯简报',
  dateCN: '2026年9月22日',
  weekday: '星期二',
  cities: '嘉兴 & 余杭',
  push: '午间版 · 12:30 更新',
  dateISO: '2026-09-22',
};

export const PREHEADER =
  '习近平将对美国进行国事访问 · 二十届五中全会 10 月 26 日至 29 日召开 · AMD 市值首破万亿美元 · 纳指涨超 2% 再创新高 · 央行召开外资金融机构座谈会';

export const BRIEFING = [
  {
    lead: '天气',
    text: '嘉兴 20~28°C 多云间阴、局部有小雨(紫外线 UV 7 较强);余杭 20~26°C 多云;两城 AQI 74(良)。',
  },
  {
    lead: 'AI 动态',
    text: 'OpenAI 被曝加紧备战 Grok Bot 与 Muse;亚马逊封禁 Meta 智能体 Muse 购物;英国央行探讨 AI 交易"紧急停止开关";美中讨论 AI 安全预警机制。',
  },
  {
    lead: '国内进展',
    text: '中央政治局会议决定二十届五中全会 10 月 26 日至 29 日召开;我国发放首批数据产权"身份证";财政部、应急管理部拨付 2 亿元支持 4 省救灾;瓦卡金沙江大桥建成。',
  },
  {
    lead: '金融财经',
    text: '纳指涨超 2% 再创新高,AMD 市值首破万亿美元;原油大跌、黄金走弱;央行召开外资金融机构座谈会,潘功胜发声;两市半日成交额超 1.4 万亿元。',
  },
  {
    lead: '国际观察',
    text: '习近平将于 9 月 23 日至 25 日对美国进行国事访问;欧盟通过对俄制裁延长三年;派拉蒙天舞与 12 州和解为收购华纳扫清道路。',
  },
];

export const WEATHER = {
  source: 'wttr.in + aqicn.org',
  rows: [
    { city: '嘉兴', temp: '20~28°C', desc: '多云间阴、局部有小雨', wind: '风速 7km/h', aqi: '74(良)' },
    { city: '余杭', temp: '20~26°C', desc: '多云', wind: '风速 7km/h', aqi: '74(良,杭州站代理)' },
  ],
  note: '嘉兴湿度 63%、降水概率 12%、紫外线 UV 7 较强,注意防晒补水;余杭湿度 71%、降水概率 20%。AQI 嘉兴站更新于今早 8:00,杭州站(余杭代理)更新于 11:00,首要污染物未在数据源标注。',
};

export const MARKET_STRIP = [
  { name: '纽约期金 GC', value: '4382.96', unit: '美元/盎司', chg: '-0.02%' },
  { name: '纽约期银 SI', value: '66.61', unit: '美元/盎司', chg: '+0.29%' },
  { name: '上证指数', value: '3958.64', unit: '', chg: '+0.22%' },
  { name: 'USD/CNY', value: '6.6962', unit: '', chg: '+0.01%' },
];

const S = (media, url, date) => ({ media, url, date });
const D = (t, i, s, c) => ({ t, i, s, c });

export const SECTIONS = [
  {
    key: 'ai',
    name: 'AI 动态',
    remark: '均为窗口内核验通过条目;财联社 2 条经 API 时间戳与页面交叉人工复核。',
    items: [
      {
        no: 1, score: '7.8', dims: D(9, 7, 8, 7), srcCount: 1, main: 'TechCrunch',
        title: 'OpenAI 成立数学顾问小组:其 AI 已解决逾 100 个开放问题',
        summary: 'TechCrunch 报道,OpenAI 成立数学顾问小组,同时称其 AI 系统已解决超过 100 个数学开放问题。',
        impact: '数学成为检验 AI 推理能力的新标尺,学术共同体参与或加速前沿模型验证。',
        sources: [S('TechCrunch', 'https://techcrunch.com/2026/09/21/openai-forms-math-advisory-group-as-its-ai-resolves-more-than-100-open-problems/', '2026-09-21')],
      },
      {
        no: 2, score: '8.3', dims: D(9, 8, 8, 8), srcCount: 1, main: 'TechCrunch',
        title: "Meta 智能体 Muse 移动端早期表现超过 ChatGPT 同期",
        summary: 'TechCrunch 报道,Meta 的 AI 智能体 Muse 在移动端上线初期的用户表现超过 ChatGPT 的同期水平。',
        impact: '智能体赛道的移动端竞争全面升温,先发优势窗口正在收窄。',
        sources: [S('TechCrunch', 'https://techcrunch.com/2026/09/21/metas-muse-is-outpacing-chatgpts-early-mobile-launch/', '2026-09-21')],
      },
      {
        no: 3, score: '8.5', dims: D(9, 8, 9, 8), srcCount: 3, main: 'TechCrunch',
        title: '亚马逊封禁 Meta 智能体 Muse 的购物场景接入',
        summary: '亚马逊阻止 Meta 的 AI 智能体 Muse 在其网站进行购物操作;The Verge、Engadget 同步报道。',
        impact: '平台与 AI 智能体的入口之争公开化,智能体电商生态的开放度承压。',
        sources: [S('TechCrunch', 'https://techcrunch.com/2026/09/21/metas-ai-agent-has-been-blocked-from-using-amazon-com/', '2026-09-21'), S('The Verge', 'https://www.theverge.com/tech/998078/amazon-blocks-meta-muse-ai-agent-shopping', '2026-09-21'), S('Engadget', 'https://www.engadget.com/2263659/amazon-bars-metas-muse-ai-from-shopping-on-its-site/', '2026-09-21')],
      },
      {
        no: 4, score: '8.5', dims: D(9, 8, 9, 8), srcCount: 1, main: 'The Verge',
        title: '加州收紧 AI 数据中心能耗与用水监管',
        summary: 'The Verge 报道,加州通过新规,收紧对 AI 数据中心能源与水资源使用的监管要求。',
        impact: 'AI 基础设施的能耗治理进入硬性约束阶段,在美数据中心合规成本或上升。',
        sources: [S('The Verge', 'https://www.theverge.com/ai-artificial-intelligence/998453/california-ai-data-center-bills', '2026-09-21')],
      },
      {
        no: 5, score: '8.5', dims: D(9, 8, 9, 8), srcCount: 1, main: 'The Verge',
        title: '联合国专家小组:AI 安全护栏不能等"确定"了再建',
        summary: "The Verge 报道,联合国 AI 小组表示对 AI 风险的防范不能等待科学确定性,应采取预防性原则,报道提及 Hugging Face 遭入侵事件。",
        impact: '全球 AI 治理或加速转向"预防性"监管框架。',
        sources: [S('The Verge', 'https://www.theverge.com/ai-artificial-intelligence/998090/un-ai-panel-hugging-face-hack-precautionary-principle', '2026-09-21')],
      },
      {
        no: 6, score: '8.3', dims: D(9, 8, 8, 8), srcCount: 1, main: '财联社',
        title: 'AI 智能体之争升温:OpenAI 被曝加紧备战 Grok Bot 与 Muse',
        summary: '财联社报道,OpenAI 据称正开发新功能,对标上月推出的 Grok Bot,并考虑推出个人 AI 助手,与 Meta 的 Muse 抗衡;两者均可接入第三方应用自主执行多步骤任务。',
        impact: '智能体竞争焦点从"会聊天"转向"能办事",后台常驻的办事型智能体成为新战场。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489489', '2026-09-22')],
      },
      {
        no: 7, score: '8.3', dims: D(9, 8, 8, 8), srcCount: 1, main: '财联社',
        title: '警惕 AI 交易引发崩盘!英国央行副行长探讨设立"紧急停止开关"',
        summary: '财联社报道,英国央行副行长警告 AI 驱动的交易可能加剧市场同步性与崩盘风险,正探讨设立"紧急停止开关"。',
        impact: '金融监管开始正视 AI 交易风险,市场风控工具创新值得关注。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489463', '2026-09-22')],
      },
      {
        no: 8, score: '8.3', dims: D(9, 9, 8, 7), srcCount: 1, main: 'WIRED',
        title: '美中讨论建立 AI 国家安全事件相互预警机制',
        summary: 'WIRED 报道,美中官员正讨论建立名为 "US-China AI Dialogue" 的机制,就可能威胁国家安全的 AI 事件相互预警并继续磋商。',
        impact: '人工智能首次被纳入大国安全对话框架,技术治理外交化。',
        sources: [S('WIRED', 'https://www.wired.com/story/us-and-china-discuss-alerting-each-other-to-ai-national-security-threats/', '2026-09-21')],
      },
      {
        no: 9, score: '7.8', dims: D(9, 7, 8, 7), srcCount: 1, main: 'Engadget',
        title: '欧盟将强制数据中心披露能耗与水耗',
        summary: 'Engadget 报道,欧盟将出台规则,强制数据中心披露其能源与水资源使用情况。',
        impact: '与加州新规呼应,数据中心能效透明度成为全球监管共识。',
        sources: [S('Engadget', 'https://www.engadget.com/2264607/the-eu-will-force-data-centers-to-disclose-their-energy-and-water-use/', '2026-09-21')],
      },
      {
        no: 10, score: '7.8', dims: D(9, 7, 8, 7), srcCount: 1, main: 'Engadget',
        title: '特斯拉 FSD Supervised 辅助驾驶即将在捷克推出',
        summary: 'Engadget 报道,特斯拉将在捷克共和国推出 FSD Supervised 辅助驾驶功能。',
        impact: '特斯拉辅助驾驶在中欧市场继续扩张。',
        sources: [S('Engadget', 'https://www.engadget.com/2264292/tesla-will-soon-roll-out-fsd-supervised-in-the-czech-republic/', '2026-09-21')],
      },
    ],
  },
  {
    key: 'cn',
    name: '国内新闻',
    items: [
      {
        no: 1, score: '9.0', dims: D(9, 9, 9, 9), srcCount: 1, main: '新华网',
        title: '中央政治局会议:决定二十届五中全会 10 月 26 日至 29 日召开',
        summary: '中共中央政治局 9 月 21 日召开会议,习近平总书记主持,研究持之以恒推进全面从严治党重大问题;决定二十届五中全会于 10 月 26 日至 29 日在北京召开;听取《中共中央关于持之以恒推进全面从严治党若干重大问题的决定》稿征求意见情况报告,决定修改后提请五中全会审议。',
        impact: '为五中全会定调,全面从严治党与下一个五年规划布局是两条主线。',
        sources: [S('新华网', 'https://www.news.cn/politics/leaders/20260921/6d2f7db5a4c1477bb588a75e1ad87a4b/c.html', '2026-09-21')],
      },
      {
        no: 2, score: '8.3', dims: D(9, 8, 9, 7), srcCount: 1, main: '央视网(人工复核)',
        title: '财政部、应急管理部紧急拨付 2 亿元支持 4 省救灾(人工复核)',
        summary: '财政部、应急管理部紧急拨付 2 亿元中央自然灾害救灾资金,支持四川、海南、浙江、福建等 4 省开展洪涝、地质灾害应急抢险救灾工作。(央视网正文未含可提取发布元数据,按 URL 日期 2026-09-21 21:22 及页面版权时间人工复核)',
        impact: '中央救灾资金快速下达,支持受灾省份应急抢险与群众安置。',
        sources: [S('央视网', 'https://news.cctv.com/2026/09/21/ARTILHNkcvTh0atmHsKHoZbg260921.shtml', '2026-09-21')],
      },
      {
        no: 3, score: '8.5', dims: D(9, 7, 9, 9), srcCount: 1, main: '新华网',
        title: '瓦卡金沙江大桥建成:两岸通行由 1 小时缩至 10 分钟',
        summary: '金沙江上游川滇交界首座下承式钢箱系杆拱桥——瓦卡金沙江大桥 9 月 21 日建成。桥梁总长 212 米、主桥长 196.2 米、桥面宽 20 米、设计时速 40 公里,连接四川得荣县瓦卡镇与云南德钦县奔子栏镇,串联 G215、G214 两大国道干道。',
        impact: '结束两岸群众渡江难、绕行远的历史,推动川滇资源共享与文旅互通。',
        sources: [S('新华网', 'https://www.news.cn/politics/20260921/a1a747129da04d20bae93e4e763d3ec2/c.html', '2026-09-21')],
      },
      {
        no: 4, score: '9.0', dims: D(9, 9, 9, 9), srcCount: 1, main: '新华网',
        title: '我国发放首批数据产权"身份证":56 家企业和机构获凭证',
        summary: '新华网报道,我国发放首批数据产权登记凭证,共 56 家企业和机构获得,涵盖国有企业、事业单位和民营企业,覆盖医疗、交通、科研等 10 余个行业领域,由国家数据局统一推进。',
        impact: '数据产权登记开始落地,为数据要素市场化提供权属依据。',
        sources: [S('新华网', 'https://www.news.cn/politics/20260921/0dc3ff66bbc048aaadeb6343f4de24f2/c.html', '2026-09-21')],
      },
      {
        no: 5, score: '7.8', dims: D(9, 6, 9, 7), srcCount: 1, main: '新华网',
        title: '每天超两亿人次绿色出行',
        summary: '新华网报道,我国每天绿色出行超两亿人次。',
        impact: '绿色出行已成日常,城市交通低碳转型持续推进。',
        sources: [S('新华网', 'https://www.news.cn/comments/20260921/cd142a7144c6464dbedc9e81492a6ced/c.html', '2026-09-21')],
      },
      {
        no: 6, score: '8.0', dims: D(9, 7, 9, 7), srcCount: 1, main: '新华网',
        title: '科学与健康:揭秘北冰洋考察队如何"破冰穿雾"',
        summary: '新华网报道中国北冰洋考察队在极区"破冰穿雾"的科考过程。',
        impact: '极地科考能力持续提升,为全球气候变化研究积累数据。',
        sources: [S('新华网', 'https://www.news.cn/tech/20260921/d1515d92e35642678a4bf2b4742d0d1e/c.html', '2026-09-21')],
      },
      {
        no: 7, score: '7.5', dims: D(9, 6, 8, 7), srcCount: 1, main: '财联社',
        title: '微信新功能:发朋友圈可自动转为"仅自己可见"',
        summary: '财联社报道,微信上线新功能,用户发朋友圈可自动转为"仅自己可见",不少安卓、苹果用户已经可用。',
        impact: '降低随手发的社交压力,隐私颗粒度更细。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489526', '2026-09-22')],
      },
      {
        no: 8, score: '8.0', dims: D(9, 7, 8, 8), srcCount: 1, main: '财联社',
        title: '沈鼓集团股价持续波动,上交所将依规采取自律监管措施',
        summary: '财联社报道,沈鼓集团股价持续波动,市场人士提醒理性看待风险、切勿跟风炒作;上交所表示将持续密切关注。',
        impact: '交易所对异常炒作保持高压,提示投资者注意风险。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489438', '2026-09-21')],
      },
      {
        no: 9, score: '8.0', dims: D(9, 7, 9, 7), srcCount: 1, main: '新华网',
        title: '《非物质文化遗产保护传承"十五五"规划》印发',
        summary: '新华网报道,《非物质文化遗产保护传承"十五五"规划》印发。',
        impact: '非遗保护进入下一个五年规划周期。',
        sources: [S('新华网', 'https://www.news.cn/politics/20260921/c466699192dd4fac8e929468615af615/c.html', '2026-09-21')],
      },
      {
        no: 10, score: '7.8', dims: D(9, 6, 9, 7), srcCount: 1, main: '新华网',
        title: '17 个试点县 2939 个建制村实现"快递进村"邮政兜底',
        summary: '新华网报道,17 个试点县 2939 个建制村实现"快递进村"邮政兜底。',
        impact: '农村寄递物流体系继续补齐末端短板。',
        sources: [S('新华网', 'https://www.news.cn/politics/20260921/6ff3bfae9b5046afa5728a7c2ffbe76b/c.html', '2026-09-21')],
      },
    ],
  },
  {
    key: 'fin',
    name: '金融财经',
    table: {
      head: ['品种', '价格', '涨跌幅'],
      rows: [
        ['纽约期金(美元/盎司)', '4382.96', '-0.02%'],
        ['纽约期银(美元/盎司)', '66.61', '+0.29%'],
        ['上证指数', '3958.64', '+0.22%'],
        ['深证成指', '13814.87', '+0.62%'],
        ['创业板指', '3431.11', '+0.93%'],
        ['美元/人民币', '6.6962', '+0.01%'],
      ],
    },
    remark: '数据时间:2026-09-22 11:37 北京时间(腾讯/新浪盘中;两市半日成交额超 1.4 万亿元,金十午评) | 口径:盘中',
    items: [
      {
        no: 1, score: '8.8', dims: D(9, 9, 8, 9), srcCount: 1, main: '财联社',
        title: '美股收盘:纳指涨超 2% 再创新高,芯片股全线暴涨,AMD 市值首破万亿美元',
        summary: '美股高开高走,纳指涨超 2% 再创新高;Meta 大涨 11.43%,"Meta 版龙虾"点燃 AI 交易热情;AMD 市值首次突破 1 万亿美元;莫德纳收涨 12.27%。',
        impact: 'AI 交易热情外溢至芯片与生物科技,估值风险同步积聚。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489502', '2026-09-22')],
      },
      {
        no: 2, score: '8.5', dims: D(9, 9, 8, 8), srcCount: 1, main: '财联社',
        title: 'AMD 市值首破万亿美元!Meta 智能体热潮点燃 CPU 行情',
        summary: 'AMD 周一涨近 10%,市值首次突破 1 万亿美元,成为第四家跻身"万亿美元俱乐部"的美国芯片公司;Meta 旗下 AI 智能体 Muse 走红提振服务器 CPU 需求预期,带动英特尔、Arm 等芯片股集体大涨。',
        impact: '服务器 CPU 需求预期上修,芯片行情主线从 GPU 向 CPU 扩散。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489460', '2026-09-22')],
      },
      {
        no: 3, score: '8.5', dims: D(9, 8, 8, 9), srcCount: 1, main: '财联社',
        title: '早报:原油大跌、黄金走弱,宁德时代与江波龙披露回购进展',
        summary: '财联社早报:美股芯片股全线暴涨;原油大跌、黄金走弱;宁德时代、江波龙披露回购进展;习近平将于 9 月 23 日至 25 日对美国进行国事访问;央行召开外资金融机构座谈会,潘功胜发声;支付宝宣布组织调整和全新任命。',
        impact: '隔夜资产波动加大,回购公告显示龙头公司维稳股价意愿。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489519', '2026-09-22')],
      },
      {
        no: 4, score: '9.0', dims: D(9, 9, 9, 9), srcCount: 2, main: '上海证券报',
        title: '央行召开外资金融机构座谈会:持续完善政策供给,稳步扩大金融市场双向开放',
        summary: '中国人民银行召开外资金融机构座谈会,15 家外资金融机构负责人参会并发言(含美国银行、摩根大通、汇丰、渣打、德意志、高盛、瑞银、摩根士丹利等)。行长潘功胜表示中国经济运行总体平稳向好,将实施适度宽松货币政策,继续推动金融高水平开放,稳步扩大金融市场双向开放,优化跨境支付服务;副行长宣昌能主持会议。',
        impact: '释放金融开放与跨境支付便利化政策持续优化信号,外资机构预期改善。',
        sources: [S('上海证券报', 'https://paper.cnstock.com/html/2026-09/22/content_2271427.htm', '2026-09-21'), S('腾讯新闻', 'https://news.qq.com/rain/a/20260921A0AKSO00', '2026-09-21')],
      },
      {
        no: 5, score: '8.0', dims: D(9, 7, 8, 8), srcCount: 1, main: '财联社',
        title: '数读 IPO:2 家国家级"小巨人"企业今日上市',
        summary: '财联社报道,今日无新股申购;2 只新股上市,分别为创业板的中塑股份、北交所的世纪数码。',
        impact: '北交所与创业板持续服务专精特新企业上市。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489522', '2026-09-22')],
      },
    ],
  },
  {
    key: 'world',
    name: '国际新闻',
    items: [
      {
        no: 1, score: '9.0', dims: D(9, 9, 9, 9), srcCount: 2, main: '中国商务部',
        title: '习近平将对美国进行国事访问(9 月 23 日至 25 日)',
        summary: '外交部发言人宣布,应美利坚合众国总统特朗普邀请,习近平将于 9 月 23 日至 25 日对美国进行国事访问,双方将就重大问题深入交换意见。',
        impact: '中美元首峰会前夕,两国关系进入关键议程期,全球市场高度关注。',
        sources: [S('中国商务部', 'https://www.mofcom.gov.cn/xwfb/ldrhd/art/2026/art_794aa10ea0f84bad89b1d9cb7d8c2daa.html', '2026-09-21'), S('求是网', 'https://www.qstheory.cn/20260921/2313c3133dd74945b0f2dc650807ebec/c.html', '2026-09-21')],
      },
      {
        no: 2, score: '8.3', dims: D(9, 8, 8, 8), srcCount: 1, main: 'WIRED',
        title: 'AI、关税、稀土:特朗普与习近平华盛顿会晤前瞻',
        summary: 'WIRED 前瞻特朗普与习近平在华盛顿的会晤:双方料将围绕贸易休战到期、AI 与芯片出口限制、稀土矿产及台海/伊朗等议题博弈,但更可能维持现状而非实现突破。',
        impact: '峰会成果预期偏谨慎,市场关注关税休战与出口管制走向。',
        sources: [S('WIRED', 'https://www.wired.com/story/ai-tariffs-rare-minerals-what-to-expect-from-trumps-upcoming-summit-with-xi-jinping/', '2026-09-21')],
      },
      {
        no: 3, score: '8.3', dims: D(9, 8, 8, 8), srcCount: 1, main: '财联社',
        title: '欧盟通过延长对俄制裁方案,期限长达三年',
        summary: '财联社报道,欧盟通过延长对俄罗斯制裁方案,期限长达三年。',
        impact: '对俄制裁长期化,欧洲能源与供应链不确定性延续。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489516', '2026-09-22')],
      },
      {
        no: 4, score: '7.5', dims: D(9, 7, 8, 6), srcCount: 1, main: '财联社',
        title: '丹麦及格陵兰岛将与美国签署安全协议',
        summary: '财联社报道,丹麦及格陵兰岛将与美国签署安全协议。',
        impact: '北极地缘安全格局出现新变量。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489516', '2026-09-22')],
      },
      {
        no: 5, score: '8.3', dims: D(9, 7, 9, 8), srcCount: 2, main: '财联社',
        title: '派拉蒙天舞就收购华纳兄弟案与 12 州达成和解',
        summary: '财联社与 Engadget 报道,派拉蒙天舞就收购华纳兄弟案与美国 12 个州达成和解,为该收购扫清道路。',
        impact: '好莱坞整合加速,流媒体竞争格局或再变。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489516', '2026-09-22'), S('Engadget', 'https://www.engadget.com/2264474/paramount-settles-us-state-antitrust-lawsuit-clearing-warner-bros-acquisition-plans/', '2026-09-21')],
      },
      {
        no: 6, score: '8.0', dims: D(9, 7, 8, 8), srcCount: 1, main: '财联社',
        title: '特朗普力推与白俄罗斯达成大规模钾肥交易',
        summary: '财联社报道,特朗普力推与白俄罗斯达成大规模钾肥交易,欲在贸易战中削弱加拿大优势。',
        impact: '农产品贸易博弈外溢至全球化肥供应链。',
        sources: [S('财联社', 'https://www.cls.cn/detail/2489470', '2026-09-22')],
      },
    ],
  },
];

export const FOOTER_NOTE = '';
