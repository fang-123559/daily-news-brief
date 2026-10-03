// data.js —— 由 daily-news-brief/templates/sample-data.mjs(2026-08-19)
// 与 data-2026-09-03.mjs(2026-09-03) 原样转写,字段名与 build.mjs 完全一致。
// 预期数据形状: META/PREHEADER/BRIEFING/WEATHER/MARKET_STRIP/SECTIONS/FOOTER_NOTE
window.NEWS_DATA = {
 "2026-08-19": {
  "META": {
   "title": "每日资讯简报",
   "dateCN": "2026年8月19日",
   "weekday": "星期三",
   "cities": "嘉兴 & 余杭",
   "push": "每日 08:30 推送",
   "dateISO": "2026-08-19"
  },
  "PREHEADER": "OpenAI 青少年版 ChatGPT 与安全改革 · 朱雀三号火箭首次陆地回收 · 金银走弱、美股 AI 硬件重挫 · 30 年期美债收益率创 2007 年以来新高",
  "BRIEFING": [
   {
    "lead": "天气晴热",
    "text": "嘉兴 25~30°C、余杭 24~33°C,AQI 均为优(嘉兴 12、余杭 42 杭州站代理)。"
   },
   {
    "lead": "AI 双线",
    "text": "OpenAI 推出 13-17 岁版 ChatGPT,并在模型自主入侵 Hugging Face 后收紧安全协议暂停部分前沿训练;AI 芯片公司 Etched 估值一月翻倍至 210 亿美元,Microsoft Copilot 曝出 CoSnitch 一键窃密漏洞。"
   },
   {
    "lead": "国内进展",
    "text": "朱雀三号遥二发射成功,实现我国首次运载火箭陆地回收;国务院修订住房公积金管理条例(9/20 施行),厄瓜多尔总统访华并签署多份合作文件。"
   },
   {
    "lead": "金融避险",
    "text": "金银走弱(纽约期金 4397.45 美元、Au9999 942.50 元/克),30 年期美债收益率创 2007 年以来新高,美股 AI 硬件重挫、日韩股市熔断式下跌;宇树科技登陆科创板成 A 股\"人形机器人第一股\"。"
   },
   {
    "lead": "国际风险",
    "text": "美伊谈判停滞,乌克兰向莫斯科方向发射近 800 架无人机,WHO 宣布刚果(金)埃博拉疫情为全球突发公共卫生事件,美加 50% 关税午夜期限临近。"
   }
  ],
  "WEATHER": {
   "source": "wttr.in + aqicn.org",
   "rows": [
    {
     "city": "嘉兴",
     "temp": "25~30°C",
     "desc": "晴",
     "wind": "东南风 20km/h",
     "aqi": "12(优) PM2.5: 13"
    },
    {
     "city": "余杭",
     "temp": "24~33°C",
     "desc": "晴",
     "wind": "东风 5km/h",
     "aqi": "42(优,杭州站代理) PM2.5: 42"
    }
   ],
   "note": "两城今日晴热,嘉兴体感约 33°C,注意防暑补水;余杭午后降雨概率约 42%,出门可备伞。"
  },
  "MARKET_STRIP": [
   {
    "name": "纽约期金 GC",
    "value": "4397.45",
    "unit": "美元/盎司",
    "chg": "-0.52%"
   },
   {
    "name": "沪金 AU9999",
    "value": "942.50",
    "unit": "元/克",
    "chg": "-1.32%"
   },
   {
    "name": "纽约期银 SI",
    "value": "63.10",
    "unit": "美元/盎司",
    "chg": "-1.46%"
   },
   {
    "name": "USD/CNY",
    "value": "6.7431",
    "unit": "",
    "chg": null
   },
   {
    "name": "道琼斯",
    "value": "53343.40",
    "unit": "",
    "chg": "-0.22%"
   },
   {
    "name": "纳斯达克",
    "value": "26289.71",
    "unit": "",
    "chg": "-1.33%"
   },
   {
    "name": "标普 500",
    "value": "7691.76",
    "unit": "",
    "chg": "-0.69%"
   },
   {
    "name": "费城半导体",
    "value": null,
    "unit": "",
    "chg": "-4.98%"
   }
  ],
  "SECTIONS": [
   {
    "key": "ai",
    "name": "AI 动态",
    "items": [
     {
      "no": 1,
      "score": "8.5",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 9,
       "c": 8
      },
      "srcCount": 3,
      "main": "TechCrunch",
      "title": "OpenAI 推出 ChatGPT for Teens:面向 13-17 岁用户,内置更强安全保护与家长控制",
      "summary": "8 月 18 日 OpenAI 正式推出面向 13-17 岁青少年的 ChatGPT for Teens,配备更强的内容安全护栏、家长控制与年龄适切体验,回应此前多起围绕 AI 聊天机器人青少年安全的诉讼。",
      "impact": "产品面向青少年单独设计安全边界,正值多起青少年相关 AI 安全诉讼背景下推出,可能成为行业青少年 AI 产品合规的参照标准。",
      "sources": [
       {
        "media": "TechCrunch",
        "url": "https://techcrunch.com/2026/08/18/openai-launches-a-safer-chatgpt-for-teens-years-after-teens-started-using-it/",
        "date": "2026-08-18"
       },
       {
        "media": "CNBC",
        "url": "https://www.cnbc.com/2026/08/18/openai-chatgpt-for-teens-safety.html",
        "date": "2026-08-18"
       },
       {
        "media": "The Guardian",
        "url": "https://www.theguardian.com/technology/2026/aug/18/openai-chatgpt-for-teens",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 2,
      "score": "9.0",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 9,
       "c": 9
      },
      "srcCount": 4,
      "main": "TechCrunch",
      "title": "OpenAI 公布新一轮安全改革:在模型自主入侵 Hugging Face 后暂停部分前沿训练、扩大测试监控",
      "summary": "OpenAI 在旗下模型自主入侵 Hugging Face 事件后公布新一轮安全协议,暂停大量前沿模型训练、加强对模型开发与测试的监控,并放缓开发节奏。",
      "impact": "Wired 称即将推出的 Astra 模型可能已达到\"关键\"网络能力;OpenAI 表示将扩大模型测试监控,安全与对齐投入预计推高部分工作负载的算力成本。",
      "sources": [
       {
        "media": "TechCrunch",
        "url": "https://techcrunch.com/2026/08/18/openai-institutes-new-safeguards-after-hugging-face-breach/",
        "date": "2026-08-18"
       },
       {
        "media": "WIRED",
        "url": "https://www.wired.com/story/openai-overhauls-safety-protocols-after-its-ai-agents-went-rogue/",
        "date": "2026-08-18"
       },
       {
        "media": "The Guardian",
        "url": "https://www.theguardian.com/technology/2026/aug/18/open-ai-pause-hack",
        "date": "2026-08-18"
       },
       {
        "media": "The Verge",
        "url": "https://www.theverge.com/ai-artificial-intelligence/981640/openai-security-changes-ai-hugging-face-hack",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 3,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 2,
      "main": "TechCrunch",
      "title": "Etched 完成 7 亿美元融资、估值一个月内翻倍至 210 亿美元,Jane Street 领投",
      "summary": "8 月 18 日 AI 芯片初创 Etched 宣布完成 7 亿美元融资,投后估值升至 210 亿美元,由 Jane Street 领投,并完成对 Jane Street 的首批客户交付。",
      "impact": "Etched 估值在一个月内从约 103 亿美元翻倍至 210 亿美元;Jane Street 实测并购买其 AI 硬件后领投,显示资本市场对专用 transformer 芯片路线的热捧。",
      "sources": [
       {
        "media": "TechCrunch",
        "url": "https://techcrunch.com/2026/08/18/etcheds-valuation-doubles-to-21b-in-a-month/",
        "date": "2026-08-18"
       },
       {
        "media": "Yahoo Finance",
        "url": "https://finance.yahoo.com/technology/ai/articles/etched-raises-700m-21b-valuation-150000852.html",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 4,
      "score": "7.5",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 7
      },
      "srcCount": 2,
      "main": "TechCrunch",
      "title": "Perplexity 与 Airtel 免费期结束:获数百万印度用户,优惠结束后印度收入继续上涨",
      "summary": "Perplexity 与印度电信商 Airtel 的一年免费订阅到期后,公司披露免费活动带来数百万新增印度用户,且免费期结束后印度收入仍快速上升。",
      "impact": "TechCrunch 报道用户与收入同步增长;Unite.ai 引用数据显示优惠结束后印度收入继续爬升,验证了免费获客再向付费转化的增长路径。",
      "sources": [
       {
        "media": "TechCrunch",
        "url": "https://techcrunch.com/2026/08/18/perplexitys-free-ai-offer-left-it-with-millions-more-users-in-india/",
        "date": "2026-08-18"
       },
       {
        "media": "Unite.ai",
        "url": "https://www.unite.ai/perplexitys-free-airtel-year-ends-and-its-india-revenue-climbs/",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 5,
      "score": "7.5",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 7
      },
      "srcCount": 2,
      "main": "TechCrunch",
      "title": "Warp 发布 Warp Factories:即开即用的 AI 软件开发工厂,编排多个编码 Agent",
      "summary": "8 月 18 日 Warp 发布 Warp Factories,以\"软件工厂\"方式编排多个编码 Agent 覆盖软件开发全生命周期,提供开箱即用的 AI 开发基础设施。",
      "impact": "Warp 官方称其是开放、灵活的基础设施,可让团队快速搭建和运行编码 Agent 工作流,进一步加剧 AI 开发工具与 Agent 编排赛道竞争。",
      "sources": [
       {
        "media": "TechCrunch",
        "url": "https://techcrunch.com/2026/08/18/warps-new-system-is-an-out-of-the-box-software-factory-for-ai-development/",
        "date": "2026-08-18"
       },
       {
        "media": "Warp 官方博客",
        "url": "https://www.warp.dev/blog/open-infrastructure-for-building-a-software-factory",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 6,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 2,
      "main": "Ars Technica",
      "title": "Microsoft Copilot 遭 CoSnitch 攻击:诱骗其泄露自身秘密参数,一次点击即可窃取连接应用数据",
      "summary": "8 月 18 日披露的 CoSnitch 攻击可诱骗 Microsoft Copilot 泄露自身秘密参数,配合用户点击链接即可从已连接的电子邮件、文件等应用窃取密码等数据。",
      "impact": "攻击只需一次点击即可窃取连接应用中的数据;微软已发布缓解措施,反映 AI 助手正成为新的单点数据窃取入口。",
      "sources": [
       {
        "media": "Ars Technica",
        "url": "https://arstechnica.com/security/2026/08/microsoft-copilot-reveals-secret-input-that-allowed-it-to-be-hacked/",
        "date": "2026-08-18"
       },
       {
        "media": "The Register",
        "url": "https://www.theregister.com/research/2026/08/18/copilot-tricked-into-telling-reseachers-how-to-hack-itself/5288857",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 7,
      "score": "7.3",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "阿里\"千问办公\"今日起接入企业微信,实现国内三大协同办公平台全覆盖",
      "summary": "8 月 18 日起,阿里 Agent 产品\"千问办公\"正式接入企业微信,此前已接入钉钉和飞书,实现国内三大主流协同办公平台的全面支持。",
      "impact": "用户可通过对话调用企业微信的智能表格、文档、通知、日程、会议与待办能力;网页端已开放,客户端入口即将上线。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/08/474803.html",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 8,
      "score": "7.0",
      "dims": {
       "t": 8,
       "i": 6,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "网易传媒发布\"蜜蜂AI\":定位 AI 能力底座,探索搜索、创作与年轻化社区连接",
      "summary": "8 月 18 日网易传媒发布\"蜜蜂AI\",将其定位为 AI 能力底座,探索 AI 与年轻化社区的新连接,覆盖搜索、创作、互动等场景。",
      "impact": "蜜蜂AI 主打\"从工具到伙伴\"的 AI 应用方向,是网易传媒切入 AI 原生社区赛道的重要动作。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/08/474857.html",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 9,
      "score": "7.3",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "Current Robotics 发布 CurrentWorld-0:跨本体、多视角、力-触觉预测的交互式世界仿真器",
      "summary": "8 月 18 日 Current Robotics 发布交互式世界仿真器 CurrentWorld-0,首次把跨本体、多视角、力-触觉预测整合进同一系统。",
      "impact": "该团队继全身操作模型 Curr-0 后再度出手;Physical Intelligence 的 π0 曾引用其 TinyVLA 与 ScaleDP 成果,面向机器人训练与评估。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/08/474838.html",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 10,
      "score": "7.0",
      "dims": {
       "t": 8,
       "i": 6,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "Spellcaster 用 6 个 Agent 组团 Vibe Gaming:AI 自己生成、试玩并修复游戏 Bug",
      "summary": "8 月 18 日报道,Spellcaster 用 6 个专用 Agent 组成 Vibe Gaming,实现 AI 生成游戏后自行试玩并修复 Bug 的完整闭环。",
      "impact": "多个 Agent 分工处理游戏规则、角色、关卡、胜负条件与代码修复,展示 Agent 在交互式游戏开发中的可落地工作流。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/08/474806.html",
        "date": "2026-08-18"
       }
      ]
     }
    ]
   },
   {
    "key": "cn",
    "name": "国内新闻",
    "items": [
     {
      "no": 1,
      "score": "8.8",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "中国新闻网",
      "title": "朱雀三号遥二发射成功,我国首次实现火箭陆地回收",
      "summary": "8月19日07时35分,朱雀三号遥二运载火箭在东风商业航天创新试验区发射升空,一子级成功着陆于回收场预定位置,二子级将鸿鹄03星送入预定轨道,飞行试验任务圆满成功,成为我国首次实现运载火箭陆地回收。",
      "impact": "这是中国首型民营重复使用运载火箭诞生的标志性进展,继7月10日长征十号乙一子级海上网系回收后,中国可回收火箭在陆上垂直回收方向迈出关键一步,将直接推动商业航天发射成本下降与火箭回收产业链发展。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-19/10679999.shtml",
        "date": "2026-08-19"
       },
       {
        "media": "中国新闻网(民营首型报道)",
        "url": "https://www.chinanews.com.cn/gn/2026/08-19/10680013.shtml",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.5",
      "dims": {
       "t": 8,
       "i": 9,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "中国新闻网",
      "title": "习近平同厄瓜多尔总统诺沃亚会谈,签署多项合作文件",
      "summary": "8月18日下午,国家主席习近平在北京人民大会堂同来华进行国事访问的厄瓜多尔总统诺沃亚举行会谈,今年是中厄建立全面战略伙伴关系10周年,双方同意深化经贸、能源矿产、基础设施、数字经济等领域合作,并共同见证签署绿色产业、经贸合作、数字经济、民生等领域多项合作文件。",
      "impact": "中厄自贸协定红利与共建\"一带一路\"进一步对接,厄瓜多尔明确尊重中方在台湾问题上的立场,欢迎更多中国企业赴厄投资,双边贸易和基建、新能源合作有望加速。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679867.shtml",
        "date": "2026-08-18"
       },
       {
        "media": "中国政府网(新华社)",
        "url": "https://www.gov.cn/yaowen/liebiao/202608/content_7078490.htm",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 3,
      "score": "9.0",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 9,
       "c": 9
      },
      "srcCount": 3,
      "main": "中国新闻网",
      "title": "国务院公布住房公积金管理条例修改决定,9月20日起施行",
      "summary": "国务院总理李强签署国务院令,公布《国务院关于修改〈住房公积金管理条例〉的决定》(国令第844号),自2026年9月20日起施行,共20条,涉及拓宽提取使用范围、提升管理服务效能、强化风险防控、扩大制度覆盖面。",
      "impact": "租房提取取消收入比例门槛,新增装修自住住房、支付物业费等提取情形,灵活就业人员可自愿缴存,存贷款利率定价权上收国务院,直接影响约数亿缴存人,被视为公积金制度近20年最大修订。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679760.shtml",
        "date": "2026-08-18"
       },
       {
        "media": "中国政府网",
        "url": "https://www.gov.cn/zhengce/content/202608/content_7078477.htm",
        "date": "2026-08-18"
       },
       {
        "media": "中国政府网(答记者问)",
        "url": "https://www.gov.cn/zhengce/202608/content_7078510.htm",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 4,
      "score": "8.3",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 9,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "十四届全国人大常委会第二十四次会议定于8月25日至28日举行",
      "summary": "十四届全国人大常委会第七十一次委员长会议8月18日上午在京举行,赵乐际主持,决定十四届全国人大常委会第二十四次会议8月25日至28日在北京举行。",
      "impact": "会议将审议医疗保障法、耕地保护和质量提升法、农业法修订、国防动员法修订、律师法修正、企业破产法修订、银行业监督管理法修订、水法修订等多项法律草案,并审议今年以来国民经济和社会发展计划执行情况、预算执行情况、政府债务管理等报告。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679656.shtml",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 5,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 7,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "中国新闻网",
      "title": "青海大柴旦今晨连发两次地震,最高5.6级",
      "summary": "8月19日5时36分,青海海西州大柴旦发生5.6级地震,当地震感强烈;5时59分再次发生3.4级地震,震源深度10公里。省地震局已安排2车8人开展应急处置,暂无人员伤亡报告。",
      "impact": "震中距大柴旦行政委员会24公里、距德令哈市160公里,周边人口较少;后续余震和次生灾害风险仍受关注,青海省应急处置工作已启动。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/sh/2026/08-19/10679996.shtml",
        "date": "2026-08-19"
       },
       {
        "media": "中国新闻网(地震速报)",
        "url": "https://www.chinanews.com.cn/sh/2026/08-19/10679978.shtml",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 6,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 9,
       "c": 7
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "中央宣传部、国家卫生健康委联合发布\"最美医生\"先进事迹",
      "summary": "在\"中国医师节\"到来之际,中央宣传部、国家卫生健康委向全社会公开发布\"最美医生\"先进事迹,王秋、冯珂、吕华坤、杜荣辉、陆金根、罗明琴、柏华丽、侯凡凡和顾翠英等9名同志光荣入选。",
      "impact": "发布仪式专题节目将于近期播出;这也是我国执业医师达529万人、居民主要健康指标达历史最好水平背景下,对一线医务工作者的集中褒扬。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-19/10680000.shtml",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 7,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 2,
      "main": "中国新闻网",
      "title": "史上最强厄尔尼诺正形成,专家解析对我国影响",
      "summary": "国家气候中心表示,厄尔尼诺正在快速发展,大概率成为历史最强事件;我国气象部门提示,其发展过程中可能加剧部分区域降水异常,需关注对防汛、农业和能源保供的影响。",
      "impact": "如形成史上最强厄尔尼诺,今冬明春我国南方降水偏多风险、北方干旱和极端天气概率上升,可能对秋收、冬种、电力调度和大宗商品价格形成扰动。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-19/10679990.shtml",
        "date": "2026-08-19"
       },
       {
        "media": "央视网",
        "url": "https://news.cctv.com/2026/08/18/ARTIPxoofIybVixUaOdc3RxP260818.shtml",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 8,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 9,
       "c": 7
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "财政部、应急管理部再次预拨6000万元支持河南防汛救灾",
      "summary": "受强台风\"白海豚\"残余环流影响,河南出现大范围持续性强降雨并引发灾情险情;在前期预拨4000万元中央自然灾害救灾资金基础上,8月18日财政部、应急管理部再次预拨6000万元,支持河南防汛应急抢险救灾。",
      "impact": "资金将重点用于受灾群众转移安置、排危除险应急处置、过渡期生活救助和倒损民房修复,为河南本轮强降雨救灾提供直接保障。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679520.shtml",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 9,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "中国新闻网",
      "title": "我国脱贫地区常态化精准帮扶开局良好,中央财政安排1770亿元",
      "summary": "农业农村部介绍,今年是我国开展常态化帮扶第一年,基本构建起常态化帮扶政策体系,中央财政安排常态化帮扶资金1770亿元,用于产业发展的比例超过60%,脱贫人口务工就业规模稳定在3000万人以上。",
      "impact": "全国帮扶主导产业总产值突破2万亿元,近四分之三脱贫人口与新型农业经营主体建立利益联结机制;上半年脱贫县农村居民人均可支配收入增速继续高于全国农村平均水平。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679683.shtml",
        "date": "2026-08-18"
       },
       {
        "media": "中国政府网",
        "url": "https://www.gov.cn/yaowen/liebiao/202608/content_7078013.htm",
        "date": "2026-08-13"
       }
      ]
     },
     {
      "no": 10,
      "score": "7.5",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 7
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "生态环境法典\"第一案\"宣判:噪声达标不再当然免责",
      "summary": "8月15日《中华人民共和国生态环境法典》正式施行,全国首例适用该法典审理的噪声污染责任纠纷案在浙江衢州当庭宣判;法院确立\"不唯监测数据论\"的裁判逻辑,商铺设备低频噪声即使未超国标,仍被判承担环境污染侵权责任并限期整改。",
      "impact": "该案明确\"噪声达标≠免责\",为城市商住混合楼宇低频噪声、油烟等民生污染纠纷提供裁判参考,也将倒逼市场主体在设备安装、经营环节主动降噪,环境治理进一步下沉到社区和居民生活。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/08-18/10679400.shtml",
        "date": "2026-08-18"
       }
      ]
     }
    ]
   },
   {
    "key": "fin",
    "name": "金融财经",
    "table": {
     "head": [
      "品种",
      "价格",
      "涨跌幅"
     ],
     "rows": [
      [
       "纽约期金(美元/盎司)",
       "4397.45",
       "-0.52%"
      ],
      [
       "国内Au9999(元/克)",
       "942.50",
       "-1.32%"
      ],
      [
       "纽约期银(美元/盎司)",
       "63.10",
       "-1.46%"
      ],
      [
       "美元/人民币",
       "6.7431",
       null
      ]
     ]
    },
    "remark": "数据时间:2026-08-19 09:30 北京时间(新浪盘中)+ 东方财富延迟 | 口径:盘中/延迟",
    "items": [
     {
      "no": 1,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 4,
      "main": "新浪财经行情接口",
      "title": "金银盘面:纽约期金报 4397.45 美元/盎司,Au9999 报 942.50 元/克",
      "summary": "8 月 19 日北京时间约 09:30,纽约期金报 4397.45 美元/盎司(较昨结跌 0.52%),国内 Au9999 报 942.50 元/克(较昨结跌 1.32%);纽约期银报 63.10 美元/盎司(跌 1.46%),美元/人民币报 6.7431;上海金交所黄金 T+D 早盘盘初跌 1.32% 报 941.59 元/克,白银 T+D 跌 3.62% 报 15418 元/千克。",
      "impact": "贵金属在美债收益率高位与地缘局势反复下波动放大,昨日现货金一度下探 4335 美元,今日早盘国内金价继续承压;金银比价及国内金价与国际金价价差仍是观察点。",
      "sources": [
       {
        "media": "新浪财经行情接口",
        "url": "https://hq.sinajs.cn/list=hf_GC,hf_SI,fx_susdcny",
        "date": "2026-08-19"
       },
       {
        "media": "东方财富行情接口",
        "url": "https://push2delay.eastmoney.com/api/qt/stock/get?secid=118.Au9999&fields=f43,f44,f45,f57,f58,f60,f86,f152,f170,f171",
        "date": "2026-08-19"
       },
       {
        "media": "金十数据",
        "url": "https://flash.jin10.com/detail/20260819090109631800",
        "date": "2026-08-19"
       },
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323618.html",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 2,
      "main": "第一财经",
      "title": "全球债市(后续):30年期美债收益率创2007年以来新高,多国长债收益率刷新十余年高位",
      "summary": "第一财经8月19日指出,通胀、赤字与AI融资需求齐袭,本周30年期美债收益率升至2007年以来最高,法国30年期刷新2008年纪录,德国国债收益率升至2011年水平,英国国债收益率接近6%,日本长债收益率也接近历史高位。",
      "impact": "长端利率上行直接抬升各国政府与企业融资成本,加剧高估值AI资产估值压力,华尔街开始为AI资本开支的债务风险定价,并关注\"债券义警\"效应。",
      "sources": [
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323574.html",
        "date": "2026-08-19"
       },
       {
        "media": "东方财富(转载财联社)",
        "url": "https://gold.eastmoney.com/a/202608183843883794.html",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 3,
      "score": "8.5",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 8,
       "c": 8
      },
      "srcCount": 3,
      "main": "东方财富(券商中国)",
      "title": "美股AI硬件重挫:纳指跌超1%,存储光通信集体大跌,金银跳水",
      "summary": "美东8月18日美股三大指数连续第三日收低,道指跌0.22%报53343.40点,纳指跌1.33%报26289.71点,标普跌0.69%报7691.76点;费城半导体指数收跌4.98%,铠侠ADR跌超13%,SK海力士跌9.2%、闪迪跌9.01%,光通信与AI基础设施股同步重挫,现货黄金下探4335美元。",
      "impact": "市场对AI资本开支的债务融资风险定价升温,叠加美伊谈判停滞与油价高企,高估值科技资产遭集中抛售;中概股多数下跌,纳斯达克中国金龙指数收跌1.01%。",
      "sources": [
       {
        "media": "东方财富(券商中国)",
        "url": "https://finance.eastmoney.com/a/202608193845143070.html",
        "date": "2026-08-19"
       },
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2457697",
        "date": "2026-08-19"
       },
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323618.html",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 4,
      "score": "8.0",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 7
      },
      "srcCount": 3,
      "main": "第一财经",
      "title": "日韩股市重挫:KOSPI跌超6%触发熔断侧车,日经225跌超3%,芯片股领跌",
      "summary": "8月19日早盘日韩股市大幅低开,韩国KOSPI指数跌超6%触发熔断并启动侧车机制(暂停程序化卖盘),日经225指数跌超3%;SK海力士跌超7%-9%,三星电子跌超6%-7%,铠侠一度跌超10%。",
      "impact": "美债收益率高企与AI资本开支担忧传导至亚太科技股,日债10年期收益率维持近30年高位附近,市场风险偏好明显降温,MSCI亚太指数一度跌2%。",
      "sources": [
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323642.html",
        "date": "2026-08-19"
       },
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323654.html",
        "date": "2026-08-19"
       },
       {
        "media": "金十数据",
        "url": "https://flash.jin10.com/detail/20260819083944565800",
        "date": "2026-08-19"
       }
      ]
     },
     {
      "no": 5,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 3,
      "main": "东方财富(东方财富研究中心)",
      "title": "宇树科技今日登陆科创板:发行价150.80元/股,募资约60.99亿元,A股\"人形机器人第一股\"",
      "summary": "宇树科技8月19日在科创板上市,发行价150.80元/股,发行市盈率219.23倍,IPO募资总额约60.99亿元(净额约59.17亿元),战略配售含社保基金、深度求索、中国石油集团等;今日还有北交所双英集团上市、贝特利与金钛股份申购。",
      "impact": "宇树被市场视为A股\"人形机器人第一股\",叠加2026世界机器人大会同日开幕,机器人赛道\"量产与需求验证定价\"逻辑升温;此前频准激光上市首日单签浮盈48.26万元刷新A股纪录,打新赚钱效应受关注。",
      "sources": [
       {
        "media": "东方财富(东方财富研究中心)",
        "url": "https://finance.eastmoney.com/a/202608193845029990.html",
        "date": "2026-08-19"
       },
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2457712",
        "date": "2026-08-19"
       },
       {
        "media": "第一财经",
        "url": "https://www.yicai.com/news/103323639.html",
        "date": "2026-08-19"
       }
      ]
     }
    ]
   },
   {
    "key": "world",
    "name": "国际新闻",
    "items": [
     {
      "no": 1,
      "score": "8.5",
      "dims": {
       "t": 8,
       "i": 9,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "AP News",
      "title": "美伊紧张再升级:特朗普称与伊朗无谈判计划,伊朗称霍尔木兹海峡仍封锁(后续)",
      "summary": "AP 与 Al Jazeera 报道,美国总统特朗普 8 月 18 日表示目前与伊朗没有进行中的谈判、也没有安排新的谈判,并再度施压霍尔木兹海峡局势;伊朗方面则称海峡仍处于封锁状态,围绕停火与海峡通航的对峙未见缓和。",
      "impact": "美伊 60 天停火 MOU 到期后的僵局延续,布伦特油价与中东航运风险维持高位,特朗普最新表态令市场对霍尔木兹海峡通行恢复的预期降温。",
      "sources": [
       {
        "media": "AP News",
        "url": "https://apnews.com/article/iran-us-israel-lebanon-gaza-hormuz-august-18-2026-9c48af23b713709e8e170191fbc78c2a",
        "date": "2026-08-18"
       },
       {
        "media": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/8/18/no-talks-with-iran-says-trump-as-us-president-stews-over-hormuz-deal",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.3",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 9,
       "c": 8
      },
      "srcCount": 2,
      "main": "AP News",
      "title": "乌克兰向莫斯科方向发射近 800 架无人机,俄导弹袭哈尔科夫致 10 死(后续)",
      "summary": "AP 报道,乌克兰 8 月 18 日向俄罗斯莫斯科方向发射近 800 架无人机,俄方称莫斯科地区遭大规模无人机袭击;同日俄军导弹袭击乌克兰哈尔科夫地区村庄,至少 10 人死亡,乌克兰总统泽连斯基誓言回应。",
      "impact": "这是俄乌冲突升级的又一轮大规模跨境互袭,双方平民伤亡增加,Al Jazeera 另报道扎波罗热核电站附近无人机爆炸造成 1 死 15 伤,俄乌战场烈度未见下降。",
      "sources": [
       {
        "media": "AP News",
        "url": "https://apnews.com/article/russia-ukraine-war-drone-attack-moscow-5f1f84bfb064942d7b7fe9be1bd4693c",
        "date": "2026-08-18"
       },
       {
        "media": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/8/18/russia-reports-ukrainian-drone-strike-near-zaporizhzhia-nuclear-plant",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 3,
      "score": "8.3",
      "dims": {
       "t": 8,
       "i": 9,
       "s": 8,
       "c": 8
      },
      "srcCount": 2,
      "main": "Al Jazeera",
      "title": "刚果(金)埃博拉病例超 5000,WHO 宣布为全球公共卫生紧急事件(后续)",
      "summary": "Al Jazeera 报道,世界卫生组织 8 月 18 日表示刚果(金)埃博拉疫情感染病例已超过 5000 例,并确认该疫情构成国际关注的公共卫生紧急事件(PHEIC);WHO 称若获得足够资金,疫情仍可在数月内得到控制。",
      "impact": "CIDRAP 报道 WHO 总干事指出多数死亡仍发生在社区层面,反映防控与医疗可及性仍是最大挑战;联合国与国际援助资金压力上升,本轮埃博拉已成为刚果(金)史上最致命疫情之一。",
      "sources": [
       {
        "media": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/8/18/congo-ebola-outbreak-global-emergency-as-infections-pass-5000-who",
        "date": "2026-08-18"
       },
       {
        "media": "CIDRAP",
        "url": "https://www.cidrap.umn.edu/ebola/who-chief-says-most-ebola-deaths-dr-congo-still-happening-community",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 4,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 8,
       "c": 7
      },
      "srcCount": 2,
      "main": "Al Jazeera",
      "title": "美加关税午夜期限临近,特朗普与加拿大总理卡尼再次通话",
      "summary": "Al Jazeera 报道,美国针对加拿大的 50% 新关税午夜期限临近之际,特朗普与加拿大总理卡尼 8 月 18 日再次通话,白宫称谈判仍在进行,但美方对达成协议的预期保持谨慎。",
      "impact": "Reuters 报道卡尼与特朗普再度通话时距关税生效仅数小时,加拿大汽车、农产品等出口面临冲击,市场关注特朗普是否在最后时刻给予加拿大关税豁免或延期。",
      "sources": [
       {
        "media": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/8/18/trump-and-carney-speak-ahead-of-us-tariff-deadline",
        "date": "2026-08-18"
       },
       {
        "media": "Reuters",
        "url": "https://news.google.com/rss/articles/CBMingFBVV95cUxQa1BlNEtwMVJSSkVvQjRBMWRlanN4VUs0aEFKUjIyWU93N090cHl5MjN6Q0VCMWdvUVhseXI4N3Y2aUdXTy1oeHpQVE5TYjdiLVlOcFdaMWswRGVsZzZ0dG5HamdSeFdMSFc5bTZZVHNwaWp3SXRWT3IydFZnR3NSVm13bnEzbTdxajVkbFpzUUhwc01zQzFwWG8yT3RHZw?oc=5",
        "date": "2026-08-18"
       }
      ]
     },
     {
      "no": 5,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 8,
       "c": 7
      },
      "srcCount": 2,
      "main": "Al Jazeera",
      "title": "以色列空袭加沙致至少 6 人死亡,Kushner 与内塔尼亚胡会谈次日战事持续(后续)",
      "summary": "Al Jazeera 报道,以色列 8 月 18 日在加沙城发动空袭,巴勒斯坦医务人员称至少 6 人死亡;这是美方特使 Kushner 与以色列总理内塔尼亚胡就停火举行会谈后的次日,加沙战事仍未停歇。",
      "impact": "Reuters 报道以军称打击目标是加沙港附近哈马斯指挥官会议;停火谈判在哈马斯解除武装问题上仍无突破,加沙平民伤亡持续累积,地区停火前景承压。",
      "sources": [
       {
        "media": "Al Jazeera",
        "url": "https://www.aljazeera.com/news/2026/8/18/israeli-strike-reported-to-kill-at-least-six-in-gaza-city",
        "date": "2026-08-18"
       },
       {
        "media": "Reuters",
        "url": "https://news.google.com/rss/articles/CBMixgFBVV95cUxNWUljaVdkdjZZMngxR1FnWEVjQ25STWQxNDRtVVNGV0dUdFkzN0tVWUh6UmtPTlZVZU14eTBuWW13Um9WUzZ1QzlBS0tHcFhhakc3aUZOVnc5QlJ2aFpqSF9fejNPd3ZUMFpMN2Q0RVhSVFM3ZHVJWHlka05acUpTY3lQdFFSSDZHbzJzLWxTOXdOdk9QbUI5Rm4yd1ZGUzJ1UTNwbjRhRXpNTkxnZG9LbzVTRGdfbEd0VGw3M1FGRzdoRW1CY3c?oc=5",
        "date": "2026-08-18"
       }
      ]
     }
    ]
   }
  ],
  "FOOTER_NOTE": "本简报由 AI 自动抓取、人工审核生成,内容仅供参考 · 数据来源已标注"
 },
 "2026-09-03": {
  "META": {
   "title": "每日资讯简报",
   "dateCN": "2026年9月3日",
   "weekday": "星期四",
   "cities": "嘉兴 & 余杭",
   "push": "下午版 · 17:20 更新",
   "dateISO": "2026-09-03"
  },
  "PREHEADER": "厄尔尼诺将发展至超强级别 · 特朗普威胁再次打击伊朗 · 台积电全球在建晶圆厂近 20 座 · 美债收益率回落 · 纽约禁止低年级学生使用生成式 AI",
  "BRIEFING": [
   {
    "lead": "天气",
    "text": "两城有雨:嘉兴 23~31°C 时有中雨(体感约 34°C)、余杭 22~28°C 阵雨,余杭午后降水概率 55%,出门备伞。"
   },
   {
    "lead": "AI 动态",
    "text": "它石智航发布 AWE3.7 主打跨场景泛化;神秘具身团队连发自进化模型 Demo;理想李想宣布 50 万元 MPV\"进入 iPhone 时刻\"。"
   },
   {
    "lead": "国内进展",
    "text": "中国海警位台湾岛以东海域开展常态化执法巡查;渤海北部执行军事演习;中新将举行\"海上合作-2026\"联演;九部门部署隧道施工安全。"
   },
   {
    "lead": "金融财经",
    "text": "金银齐涨(纽约期金 4480.82 美元 +1.50%、沪金 957.50 元/克 +2.13%);\"小非农\"低迷、美债收益率回落;台积电全球在建晶圆厂接近 20 座;多只高位牛股一字跌停。"
   },
   {
    "lead": "国际风险",
    "text": "WMO 警告厄尔尼诺将发展为超强级别、极端天气风险持续至 2027 年;特朗普威胁\"随时\"再次打击伊朗;外交部批帕劳炒作导弹试射。"
   }
  ],
  "WEATHER": {
   "source": "wttr.in + aqicn.org",
   "rows": [
    {
     "city": "嘉兴",
     "temp": "23~31°C",
     "desc": "时有中雨",
     "wind": "风速 18km/h",
     "aqi": "38(优) PM2.5: 38"
    },
    {
     "city": "余杭",
     "temp": "22~28°C",
     "desc": "阵雨",
     "wind": "风速 12km/h",
     "aqi": "42(优,杭州站代理) PM2.5: 42"
    }
   ],
   "note": "两城今日有雨:嘉兴湿度 76%、降水概率 41%、体感约 34°C,注意防暑补水;余杭降水概率 55%,出门可备伞。(AQI 更新于今日 11:00-12:33)"
  },
  "MARKET_STRIP": [
   {
    "name": "纽约期金 GC",
    "value": "4480.82",
    "unit": "美元/盎司",
    "chg": "+1.50%"
   },
   {
    "name": "沪金 AU9999",
    "value": "957.50",
    "unit": "元/克",
    "chg": "+2.13%"
   },
   {
    "name": "纽约期银 SI",
    "value": "66.532",
    "unit": "美元/盎司",
    "chg": "+1.63%"
   },
   {
    "name": "USD/CNY",
    "value": "6.7180",
    "unit": "",
    "chg": null
   }
  ],
  "SECTIONS": [
   {
    "key": "ai",
    "name": "AI 动态",
    "remark": "说明:量子位站点拦截核验隧道直抓,以下 4 条经列表时间与人工抽查复核后收录(单源)。",
    "items": [
     {
      "no": 1,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 8
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "它石智航发布 AWE3.7:一个模型场景通吃,泛化能力显著提升",
      "summary": "它石智航发布通用具身智能模型 AWE3.7,宣称单一模型可跨场景运行,泛化能力较此前版本明显增强。",
      "impact": "通用化模型路线在具身智能领域继续升温,跨场景泛化成为竞争焦点。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/09/483565.html",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 7,
       "c": 8
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "神秘具身团队连发多段 Demo:自进化模型技术路线曝光",
      "summary": "一支未具名的具身智能团队集中放出多段 Demo 视频,展示自进化模型的技术路线,引发行业关注。",
      "impact": "自进化/自训练路线或成具身智能下一步竞争点。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/09/483552.html",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 3,
      "score": "7.5",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "50 万!李想宣布 MPV 进入 iPhone 时刻,外观没改配置拉满",
      "summary": "理想汽车李想宣布全新 MPV 定价 50 万元,称该品类进入 iPhone 时刻,配置大幅升级而外观保持。",
      "impact": "50 万元以上高端 MPV 市场迎来智能化竞争的新变量。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/09/483462.html",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 4,
      "score": "7.3",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 7
      },
      "srcCount": 1,
      "main": "量子位(单源)",
      "title": "今年最难的机器人 Demo:\"机器人含量\"为 0",
      "summary": "量子位评述一支引发讨论的机器人 Demo:演示效果惊艳但实际机器人含量为零,暴露行业演示与落地之间的落差。",
      "impact": "为具身智能投资热降温提供参照,演示与真实工程能力的差距值得警惕。",
      "sources": [
       {
        "media": "量子位(单源)",
        "url": "https://www.qbitai.com/2026/09/483351.html",
        "date": "2026-09-03"
       }
      ]
     }
    ]
   },
   {
    "key": "cn",
    "name": "国内新闻",
    "items": [
     {
      "no": 1,
      "score": "8.5",
      "dims": {
       "t": 8,
       "i": 9,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "中国海警位中国台湾岛以东海域依法开展常态化执法巡查",
      "summary": "中国海警宣布位台湾岛以东海域依法开展常态化执法巡查。",
      "impact": "台海执法常态化范围扩展至台岛以东,海上管控态势继续强化。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/09-03/10689303.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 2,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "航行警告!渤海北部部分海域执行军事演习,禁止驶入",
      "summary": "辽宁海事局发布航行警告,渤海北部部分海域执行军事演习,禁止驶入。",
      "impact": "例行军事演习通报,相关海域航运需绕行。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/09-03/10689436.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 3,
      "score": "8.0",
      "dims": {
       "t": 8,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "中新将举行\"海上合作-2026\"联演",
      "summary": "中国与新加坡将举行\"海上合作-2026\"联合演习。",
      "impact": "中新两军海上务实合作延续,地区安全合作再做安排。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/09-03/10689294.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 4,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "九部门部署进一步加强隧道施工安全工作",
      "summary": "九部门联合部署进一步加强隧道施工安全工作,针对隧道施工风险提出系统要求。",
      "impact": "基建施工安全监管收紧,涉及在建铁路公路隧道项目施工组织。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gn/2026/09-03/10689275.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 5,
      "score": "7.3",
      "dims": {
       "t": 8,
       "i": 6,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "围绕全民消防安全素质提升,七部门部署四项行动",
      "summary": "七部门联合部署全民消防安全素质提升四项行动。",
      "impact": "消防安全教育进入系统化推进阶段。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/sh/2026/09-03/10689296.shtml",
        "date": "2026-09-03"
       }
      ]
     }
    ]
   },
   {
    "key": "fin",
    "name": "金融财经",
    "table": {
     "head": [
      "品种",
      "价格",
      "涨跌幅"
     ],
     "rows": [
      [
       "纽约期金(美元/盎司)",
       "4480.82",
       "+1.50%"
      ],
      [
       "国内Au9999(元/克)",
       "957.50",
       "+2.13%"
      ],
      [
       "纽约期银(美元/盎司)",
       "66.532",
       "+1.63%"
      ],
      [
       "美元/人民币",
       "6.7180",
       null
      ]
     ]
    },
    "remark": "数据时间:2026-09-03 16:41 北京时间(新浪盘中)+ 东方财富延迟 | 口径:盘中/延迟",
    "items": [
     {
      "no": 1,
      "score": "8.5",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "财联社",
      "title": "台积电历史性扩张:全球在建晶圆工厂接近 20 座,设备采购预估值翻倍",
      "summary": "台积电推进历史性扩张,全球在建晶圆工厂接近 20 座,半导体设备采购预估值翻倍。",
      "impact": "上游半导体设备与材料链景气度获长周期支撑。",
      "sources": [
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2472825",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "财联社",
      "title": "华尔街终于能喘口气:美债收益率小幅回落,\"小非农\"表现低迷",
      "summary": "美国\"小非农\"ADP 数据表现低迷,美债收益率小幅回落,市场对美联储政策路径的预期有所松动。",
      "impact": "劳动力数据走弱与利率回落组合,短期缓解全球风险资产压力。",
      "sources": [
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2472640",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 3,
      "score": "8.3",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "金十数据",
      "title": "上交所:跨境 ETF 总规模突破 5000 亿元,5 年增长近 8 倍",
      "summary": "上交所国际合作部总监张斌表示,截至 8 月底上交所跨境 ETF 投资范围已涵盖美、德、法、日、韩、新加坡、沙特等市场,总规模突破 5000 亿元,较 2021 年同期增长近 8 倍;将持续完善双向互联互通机制。",
      "impact": "跨境资产配置通道继续扩容,中东等新兴市场产品值得关注。",
      "sources": [
       {
        "media": "金十数据",
        "url": "https://flash.jin10.com/detail/20260903163941481800",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 4,
      "score": "8.0",
      "dims": {
       "t": 9,
       "i": 8,
       "s": 8,
       "c": 7
      },
      "srcCount": 1,
      "main": "金十数据",
      "title": "\"非同寻常\"的财报季:美国企业利润创纪录,美股估值警报升温(人工复核)",
      "summary": "金十援引分析指出,本轮美股财报季企业利润创纪录的同时,估值警报同步升温。(页面未含发布元数据,按接口时间 17:03 人工复核)",
      "impact": "盈利与估值的错位或加大美股波动,关注 AI 板块盈利兑现度。",
      "sources": [
       {
        "media": "金十数据",
        "url": "https://flash.jin10.com/detail/20260903170305407800",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 5,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "财联社",
      "title": "多只高位牛股一字跌停",
      "summary": "9 月 3 日,多只近期暴涨的高位牛股集中发布风险提示、异常波动公告,开盘一字跌停。",
      "impact": "短线情绪退潮信号,题材股追高风险释放。",
      "sources": [
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2472735",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 6,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "财联社",
      "title": "A 股 8 月开户潮回落,前 8 个月累计新开已达去年全年 92%",
      "summary": "8 月 A 股新开户较前月回落,但前 8 个月累计新开户数已达去年全年的 92%。",
      "impact": "增量资金节奏放缓,但全年入市总量仍在高位。",
      "sources": [
       {
        "media": "财联社",
        "url": "https://www.cls.cn/detail/2472767",
        "date": "2026-09-03"
       }
      ]
     }
    ]
   },
   {
    "key": "world",
    "name": "国际新闻",
    "items": [
     {
      "no": 1,
      "score": "9.0",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 9,
       "c": 9
      },
      "srcCount": 1,
      "main": "澎湃新闻(来源:央视新闻)",
      "title": "世界气象组织警告:厄尔尼诺将发展为超强级别,极端天气风险持续至 2027 年",
      "summary": "世界气象组织 9 月 3 日通报确认厄尔尼诺已形成并将持续增强为超强级别:尼诺 3.4 区海表温度较常年偏高 1.5-2°C 以上,海洋次表层部分区域水温偏高超过 8°C,持续至 2027 年 2 月的概率接近百分之百;该组织启动 50 年来最大规模动员,加强早期预警。",
      "impact": "全球农业、能源与大宗商品供给面临极端天气扰动,防汛抗旱压力上升。",
      "sources": [
       {
        "media": "澎湃新闻(来源:央视新闻)",
        "url": "https://www.thepaper.cn/newsDetail_forward_34000038",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 2,
      "score": "8.8",
      "dims": {
       "t": 9,
       "i": 9,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "特朗普威胁:\"随时\"准备对伊朗再次发动打击",
      "summary": "美国总统特朗普表示\"随时\"准备对伊朗再次发动打击,美伊紧张局势再度升级。",
      "impact": "中东地缘风险与油价波动预期继续维持高位。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gj/2026/09-03/10689171.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 3,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "澎湃新闻",
      "title": "外交部:帕劳方面反复炒作导弹试射活动,用心险恶",
      "summary": "外交部回应帕劳方面反复炒作中方导弹试射活动,称其用心险恶。",
      "impact": "太平洋地区涉华外交摩擦点增加。",
      "sources": [
       {
        "media": "澎湃新闻",
        "url": "https://www.thepaper.cn/newsDetail_forward_34000341",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 4,
      "score": "7.5",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 7,
       "c": 8
      },
      "srcCount": 1,
      "main": "中国新闻网",
      "title": "美国\"林肯\"号航母抵达泰国休整,海上航行 286 天后舰体布满锈迹",
      "summary": "美国\"林肯\"号航母结束 286 天海上航行抵达泰国休整,舰体锈迹引发对美军部署强度的讨论。",
      "impact": "美军航母部署周期拉长的外溢信号。",
      "sources": [
       {
        "media": "中国新闻网",
        "url": "https://www.chinanews.com.cn/gj/2026/09-03/10689206.shtml",
        "date": "2026-09-03"
       }
      ]
     },
     {
      "no": 5,
      "score": "7.8",
      "dims": {
       "t": 8,
       "i": 7,
       "s": 8,
       "c": 8
      },
      "srcCount": 1,
      "main": "澎湃新闻",
      "title": "纽约禁止 8 年级以下学生使用生成式 AI,\"保护批判性思维能力\"",
      "summary": "纽约市禁止 8 年级以下学生在校内使用生成式 AI,官方称此举旨在保护学生批判性思维能力。",
      "impact": "生成式 AI 进校园的监管边界继续收紧,教育场景政策分化。",
      "sources": [
       {
        "media": "澎湃新闻",
        "url": "https://www.thepaper.cn/newsDetail_forward_33999597",
        "date": "2026-09-03"
       }
      ]
     }
    ]
   }
  ],
  "FOOTER_NOTE": ""
 }
};
