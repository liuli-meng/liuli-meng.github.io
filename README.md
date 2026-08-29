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

## 三、免费上线（三选一）

**方式 A：GitHub Pages（推荐）**
1. 把 `index.html`、`css/`、`js/` 传到一个 GitHub 仓库
2. 仓库 Settings → Pages → Source 选分支
3. 网址变成 `https://你的用户名.github.io/仓库名/`

**方式 B：腾讯云 COS（国内访问快）**
1. 创建存储桶，上传这三个文件
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
