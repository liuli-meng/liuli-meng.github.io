// ===== 博客文章数据 =====
// 新增文章：照着下面任意一段复制一份，改 slug / title / date / tags / excerpt / content。
// content 是一段 HTML，可用 h2/h3/p/ul/li/code/pre/blockquote。文章按 date 倒序展示。
// 现在放的是示例文章（对应 GitHub 上的真实项目），替换成你自己写的内容即可。
window.POSTS = [
  {
    slug: 'agl-context-pro',
    title: '给 Antigravity 装个"油表"：上下文用量三重监控',
    date: '2026-10-01',
    tags: ['JavaScript', 'IDE 扩展'],
    excerpt: '对话聊着聊着被压缩了才发现前面的内容"变糊"？写了个状态栏扩展把预算、对话、官方额度三路数据一起盯上：从本机 language_server 的命令行里抠 token、反查端口、逆向 RPC，零 npm 依赖，热查询 20ms。',
    content: `
      <p>用 Antigravity（Google 那个 agentic IDE）干活很舒服，但上下文用量是个黑盒：聊着聊着它悄悄压缩了会话，你只觉得 AI 突然"失忆"了；Rules 和 Skills 每次请求注入多少预算，更是完全看不到。正好练手，写了个状态栏扩展 <code>agl-context-pro</code>，把三路数据一起盯上。</p>
      <h2>盯哪三路</h2>
      <ul>
        <li><strong>预算（Budget）</strong>：自定义内容吃掉多少注入预算，比如 <code>1.7k/20k (8.4%)</code>，还能按 Rules/Skills 逐项拆解；</li>
        <li><strong>对话（Conversation）</strong>：当前 cascade 会话实际消耗的 token，比如 <code>82.1k/256k (32.1%)</code>，发生过压缩会标出来；</li>
        <li><strong>官方额度（Quota）</strong>：服务端视角的剩余配额，和云端页面同源，逐模型显示剩余百分比和重置时间。</li>
      </ul>
      <p>三者的关系想明白就好理解了：预算是<strong>每次请求固定注入的底噪</strong>，对话是<strong>随聊天增长的动态开销</strong>，官方额度是<strong>平台计费视角的余量</strong>。</p>
      <h2>最有意思的：找到本机 LS</h2>
      <p>所有数据都来自本机 Antigravity 自带的 language_server，通过它的 Connect-RPC HTTPS 接口直接读。难点是它不写配置文件，地址和凭据全靠现场发现：</p>
      <pre><code>1. PowerShell CIM 找到所有 language_server.exe
   → 命令行参数里提取 --csrf_token
2. netstat -ano 按 PID 反查 LISTENING 端口
3. 对候选端口探活 RPC —— LS 开 HTTPS/HTTP 两个口，
   只有 HTTPS 口能完成 TLS 握手，天然筛选</code></pre>
      <p>整个过程和 IDE 还是桌面版谁启动的无关，热查询一路只要 20ms 左右。数据源里 <code>GetTokenBase</code>（预算）是我自己实测发现的接口，对话那条 trajectory RPC 的用法和压缩检测阈值则逆向自 GitHub 上的先驱项目——站在巨人肩膀上，致谢都写进 README 了。</p>
      <h2>压缩是怎么被发现的</h2>
      <p>拿会话的 trajectory steps，看相邻两个 CHECKPOINT 的 input token：<strong>骤降超过 5000 就判定发生过压缩</strong>。启发式，但实测够用——毕竟正常对话里 input 不会莫名其妙掉一截。</p>
      <h2>没 Antigravity 也能跑测试</h2>
      <p>测试不想依赖真机，就手写了 <code>mock-ls.js</code>：自签证书起一个模拟 LS，实现 4 个 RPC 方法返回固定数据（特意包含压缩、截断场景），断言解析到展示的全链路。打包也没用 vsce，一个 Python zipfile 手搓 VSIX。零 npm 依赖、无编译步骤，<code>node --check</code> 过了就能发版。</p>
      <blockquote>经验：逆向本地服务的第一步不是抓包，是翻进程命令行——很多秘密就明晃晃躺在 argv 里。</blockquote>
      <p>目前是 Windows 专用实现（PowerShell CIM + netstat），Linux/macOS 没适配，欢迎 PR。扩展从 Releases 下 <code>.vsix</code>，装完重启 IDE，状态栏就有"油表"了。</p>
    `
  },
  {
    slug: 'kpl-manager-dev-log',
    title: '从零写一个 KPL 俱乐部经营小游戏',
    date: '2026-08-20',
    tags: ['HTML', '游戏开发'],
    excerpt: '想玩电竞经理但嫌手机游戏太肝？干脆自己写一个：转会谈判、青训培养、官方两段式 BP、联赛征程，全部塞进一个单文件 HTML，双击就能玩。',
    content: `
      <p>起因很简单：想找个 KPL 题材的电竞经理游戏，翻遍应用商店都没找到合适的，要么太肝要么纯挂机。正好最近想练练原生 JS，干脆自己写一个——就是 GitHub 上那个 <code>kpl-manager</code>。</p>
      <h2>为什么是单文件 HTML</h2>
      <p>一开始就定了两个约束：不引框架、不搞构建。整个游戏就是一个 <code>index.html</code>，打开即玩，发给别人也不用教怎么装环境。所有状态塞在一个全局的 game 对象里，存档直接 <code>JSON.stringify</code> 下载成文件，读档再导回来。</p>
      <h2>核心玩法循环</h2>
      <ul>
        <li><strong>转会谈判</strong>：和选手经纪人砍价，预算有限，签字费和工资要权衡；</li>
        <li><strong>青训培养</strong>：低潜力选手便宜但成长看脸，是稳还是赌，自己选；</li>
        <li><strong>两段式 BP</strong>：按官方赛制做了 ban/pick 两段流程，对面 AI 会针对你的常用阵容做针对；</li>
        <li><strong>联赛征程</strong>：常规赛积分 → 季后赛 → 总决赛，赢下银龙杯。</li>
      </ul>
      <h2>踩过的坑</h2>
      <p>最大的坑是两段式 BP 的状态机：禁用、选用、轮换方、超时，几个状态叠在一起容易写乱。后来老老实实画了张状态转移图，把每一手之后"该谁操作、能做什么"收敛成一个纯函数，代码一下子清爽了。</p>
      <blockquote>经验：哪怕是小玩具，状态一多也得先画图再动手，不然调试全靠猜。</blockquote>
      <p>后续想加的内容：选手卡牌图鉴、赛季间的版本变动事件、以及一个简单的成就系统。感兴趣的去 GitHub 仓库玩，有想法欢迎提 issue。</p>
    `
  },
  {
    slug: 'doudizhu-ai-douzero',
    title: '用 DouZero 搭一个自己的斗地主 AI',
    date: '2026-07-15',
    tags: ['Python', '强化学习'],
    excerpt: '基于快手开源的 DouZero，从部署到跑起一副像模像样的斗地主 AI，记录一下过程中值得记的点：环境、出牌编码、以及怎么让它接入自己的界面。',
    content: `
      <p>斗地主看起来是个"简单的"游戏——一手牌只有十几张，但它是个不完美信息博弈，出牌空间和队友配合都让传统搜索方法很难做。快手的 <a href="https://github.com/kwai/DouZero" target="_blank" rel="noopener">DouZero</a> 用深度蒙特卡洛方法把这条路走通了，开源协议也友好（Apache-2.0），于是决定拿它当练手对象，仓库是 <code>doudizhu-ai</code>。</p>
      <h2>部署要点</h2>
      <p>整个流程比想象中省事：装好 PyTorch，把预训练权重拉下来，就能直接对局。核心入口就几行：</p>
      <pre><code>pip install douzero
python douzero_check.py   # 校验环境
# 加载权重后即可对局：传入手牌、三家历史出牌，返回建议动作</code></pre>
      <h2>最有意思的部分：出牌编码</h2>
      <p>DouZero 把牌面编码成 15 维 one-hot（3 到 2 加王），动作空间则是所有合法出牌组合。理解了这套编码，很多"AI 为什么这么出"的问题就解释通了——它看到的不是"一对 3"，而是向量里两个置位点。</p>
      <h2>下一步</h2>
      <p>目前只能命令行里玩，下一步想给它套一个 Web 界面，做成"人机同桌"，再顺手记录胜率统计。感兴趣的同学可以关注仓库动态。</p>
    `
  },
  {
    slug: 'fileorganizer-powershell',
    title: 'C 盘又红了？我写了个自动整理工具',
    date: '2026-06-10',
    tags: ['PowerShell', '效率工具'],
    excerpt: '下载文件夹三年没清理是什么体验？写了个 PowerShell 脚本按规则自动归类文件，重点是 Dry Run：先给你看它打算怎么动你的文件，确认了才动手。',
    content: `
      <p>C 盘变红的那一刻，人是要崩溃的。翻了翻下载文件夹：安装包、压缩包、PDF、表情包……三年没整理，肉眼收拾是不可能的，于是有了 <code>FileOrganizer</code>——一个 PowerShell 写的文件自动整理工具。</p>
      <h2>设计原则：先看后动</h2>
      <p>整理文件最怕的不是乱，是<strong>动错了</strong>。所以这个工具的第一原则是 <code>-DryRun</code>：不带参数运行，只打印"它打算把哪个文件挪到哪"，一行都不真的动。确认输出没问题，再加参数正式执行。</p>
      <pre><code># 预览模式：只看不动
.\FileOrganizer.ps1 -Path "C:\Users\me\Downloads" -DryRun

# 确认无误后正式执行
.\FileOrganizer.ps1 -Path "C:\Users\me\Downloads"</code></pre>
      <h2>规则怎么定</h2>
      <ul>
        <li>按扩展名归类：安装包、压缩包、文档、图片、视频各回各家；</li>
        <li>超过一定天数没动过的文件才整理，最近下载的留着；</li>
        <li>重名不覆盖，自动加序号后缀。</li>
      </ul>
      <h2>一个教训</h2>
      <blockquote>任何批量动文件的操作，先备份、再 Dry Run、最后小范围试跑。三步都别省。</blockquote>
      <p>工具已经放在 GitHub 上，规则表就是一个 PowerShell 哈希表，想加自己的分类改几行就行。</p>
    `
  }
];
