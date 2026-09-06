# 个人主页（Brittany Chiang 风格）

纯 HTML/CSS/JS 的个人开发者主页，配色与布局借鉴了 GitHub 上最经典的开发者主页
[bchiang7/v4](https://github.com/bchiang7/v4)（8,200+ star，原作者要求保留署名，已放在页脚和本文件里）。
深色 navy 底 + 荧光绿点缀 + 等宽字体细节，无框架、无依赖，双击 `index.html` 就能打开。

## 一、改成你的信息（两处）

**1. `js/main.js` 顶部的 CONFIG —— 最重要的一个**：

```js
const CONFIG = {
  githubUser: '',                        // ← 填你的 GitHub 用户名，如 'pymili'
  roles: ['大学生', '竞赛爱好者', '代码爱好者'],  // ← 首页打字机轮流显示的标签
  github: 'https://github.com/你的用户名',
  bilibili: 'https://space.bilibili.com/你的uid',
  email: 'youremail@example.com'
};
```

- **填了 `githubUser`**：自动从 GitHub 官方接口拉取「公开仓库数 / 总 Star / 关注者 / 贡献」，
  并按 Star 从高到低展示前 9 个仓库。以后推了新仓库页面自动更新，不用改代码。
- **没填**：显示占位项目，直接改 `PLACEHOLDER_REPOS` 数组。

**2. `index.html` 里的文字**：

| 搜索 | 替换为 |
|------|--------|
| `琉璃` | 想显示的名字（现在用网名"琉璃"，要换成真名就全局替换） |
| `大学生，喜欢把想法做成能用的东西...` | 你的自我介绍 |
| `你好，我是琉璃...` | 关于我段落 |
| 技术栈 chips | 你实际会的，不熟的删掉 |

## 二、本地预览

双击 `index.html`。填了 `githubUser` 的话数据拉取需要联网。

## 三、写博客文章

文章数据都存在 `js/posts.js` 里，新增一篇 = 复制一段 `{ ... }` 改内容：

- `slug`：文章的网址名，如 `'my-first-post'`，别和已有的重复
- `title` / `date` / `tags` / `excerpt`：标题、日期、标签、摘要
- `content`：正文，是一段 HTML，能用 `h2 / h3 / p / ul / li / code / pre / blockquote / a`
- **同时更新两处**：`rss.xml` 里照格式加一个 `<item>`（订阅源是静态文件，不会自动生成）；
  `sitemap.xml` 里加一条 `<url>`（顺手改 lastmod，不改也不影响收录）

首页自动显示最新 3 篇，[blog.html](blog.html) 显示全部，点开进 `post.html?slug=文章名` 阅读。
现在放的是 3 篇示例文章（对应 GitHub 上的真实项目），替换成你自己写的即可。

## 五、评论与分享（已配置，差一步手动安装）

**文章评论（giscus）**：数据存在本仓库的 GitHub Discussions 里，无广告、无第三方数据库。
仓库已开启 Discussions，`js/blog.js` 里的 `COMMENTS` 配置也已填好 ID。
**唯一要手动做的一步**：打开 <https://github.com/apps/giscus> → Install → 只勾选
`liuli-meng.github.io` 这个仓库。装完评论立即可用；不想要评论就把 `COMMENTS.enabled` 改为 `false`。

**社交分享卡片**：分享到微信 / QQ / Twitter 会显示根目录的 `og-image.png`（1200×630）。
想换图直接覆盖它，或改名字/配色后运行 `python tools/make_og_image.py` 重新生成。

## 四、免费上线（三选一）

**方式 A：GitHub Pages（推荐）**
1. 把整个目录（`index.html`、`blog.html`、`post.html`、`404.html`、`css/`、`js/`）传到一个 GitHub 仓库
2. 仓库 Settings → Pages → Source 选分支
3. 网址变成 `https://你的用户名.github.io/仓库名/`

**方式 B：腾讯云 COS（国内访问快）**
1. 创建存储桶，上传整个目录
2. 存储桶 → 概览 → 打开「静态网站」开关，复制访问域名

**方式 C：Vercel**
1. vercel.com 绑定 GitHub → New Project → 导入仓库 → Deploy

想自定义域名：任意平台买一个（10~100 元/年），按文档做 CNAME 解析。
GitHub Pages 和 COS 的静态站不用备案。

## 设计参考（GitHub 上搜到的热门模板）

- [bchiang7/v4](https://github.com/bchiang7/v4) · 8.2k star · 本页设计来源，深色 navy + 荧光绿
- [cobiwave/simplefolio](https://github.com/cobiwave/simplefolio) · 14k star · 简洁渐变风格
- [codewithsadee/vcard-personal-portfolio](https://github.com/codewithsadee/vcard-personal-portfolio) · 7.9k star · 纯 HTML/CSS 移动优先
- [arifszn/gitprofile](https://github.com/arifszn/gitprofile) · 2.3k star · 输 GitHub 用户名自动生成（和本页的自动同步思路一致）
