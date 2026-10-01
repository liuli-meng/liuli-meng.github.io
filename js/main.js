// ===== 在这里改成你的信息 =====
const CONFIG = {
  githubUser: 'liuli-meng',              // 你的 GitHub 用户名（2026-08-29 定名：琉璃+灵梦）
  roles: ['大学生', '比赛选手', '爬虫与可视化玩家'],  // 首页打字机效果轮流显示的标签
  github: 'https://github.com/liuli-meng',
  bilibili: 'https://space.bilibili.com/你的uid',
  email: 'lcyxzl@gmail.com'              // 2026-08-29 用户提供（gamil 笔误按 gmail 处理，若非此地址请纠正）
};

// 各语言对应的 GitHub 圆点颜色（缺省用灰色）
const LANG_COLORS = {
  Python: '#3572A5', Java: '#b07219', JavaScript: '#f1e05a',
  TypeScript: '#3178c6', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Go: '#00ADD8',
  Rust: '#dea584', PHP: '#4F5D95', Kotlin: '#A97BFF', Swift: '#F05138',
  Dart: '#00B4AB', Shell: '#89e051', PowerShell: '#012456',
  'Jupyter Notebook': '#DA5B0B'
};

// GitHub 数据缓存：网页在无网络/受限环境下拉取失败时用它渲染，保证始终显示真实项目
//（部署上线后正常联网会自动拉取最新数据，此缓存仅作兜底，可定期手动更新）
// 2026-10-01 手动刷新：与 GitHub API 返回顺序一致（按 star 降序，star 相同按最近更新）
const REPO_FALLBACK = [
  { name: 'doudizhu-ai', lang: 'Python', desc: '基于 DouZero 的斗地主 AI（Apache-2.0，参考 kwai/DouZero）', stars: 1, forks: 0, url: 'https://github.com/liuli-meng/doudizhu-ai' },
  { name: 'FileOrganizer', lang: 'PowerShell', desc: 'C 盘文件自动整理工具（PowerShell）：按规则归类文件，支持 Dry Run 预览，整理 C 盘更安心', stars: 1, forks: 0, url: 'https://github.com/liuli-meng/FileOrganizer' },
  { name: 'github-apk-to-phone', lang: '', desc: 'WorkBuddy skill: download APK from GitHub Releases and push to Android phone via adb', stars: 1, forks: 0, url: 'https://github.com/liuli-meng/github-apk-to-phone' },
  { name: 'agl-context-pro', lang: 'JavaScript', desc: 'Antigravity IDE context monitor: budget (Rules/Skills) + conversation tokens + official quota, zero-dependency VSIX extension', stars: 0, forks: 0, url: 'https://github.com/liuli-meng/agl-context-pro' },
  { name: 'kpl-manager', lang: 'JavaScript', desc: '王者电竞经理 · KPL 篇 —— KPL 俱乐部经营同人游戏：转会谈判 / 训练青训 / 官方两段式 BP / 联赛征程，单文件 HTML 双击即玩（非官方同人作品）', stars: 0, forks: 0, url: 'https://github.com/liuli-meng/kpl-manager' },
  { name: 'liuli-meng.github.io', lang: 'JavaScript', desc: 'liuli personal site', stars: 0, forks: 0, url: 'https://github.com/liuli-meng/liuli-meng.github.io' }
];
const STATS_FALLBACK = { repos: 6, followers: 0, stars: 3, contrib: 188 };

// 没填 githubUser 时展示的占位项目（直接改这里就行）
const PLACEHOLDER_REPOS = [
  { name: '项目名称一', lang: 'Python', desc: '一句话说明这个项目做了什么、你在里面负责什么。比如「XX竞赛项目，负责数据采集与可视化」。', stars: 0, forks: 0, url: '#' },
  { name: '项目名称二', lang: 'Vue', desc: '一句话说明这个项目做了什么。可以写上技术栈，比如「Vue3 + Flask 的 XX 系统」。', stars: 0, forks: 0, url: '#' },
  { name: '项目名称三', lang: 'JavaScript', desc: '一句话说明这个项目做了什么。爬虫抓数据、清洗后做可视化分析的完整流程。', stars: 0, forks: 0, url: '#' },
  { name: '项目名称四', lang: 'C++', desc: '一句话说明这个项目做了什么。想放更多项目就照着这个数组再加几行。', stars: 0, forks: 0, url: '#' },
  { name: '项目名称五', lang: 'Python', desc: '一句话说明这个项目做了什么。不想要占位项目就把这个数组删空，或者换成真实的。', stars: 0, forks: 0, url: '#' }
];

// ===== 以下不用改 =====
const STAR_ICON = '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>';
const FORK_ICON = '<svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/></svg>';

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function renderRepos(list) {
  const grid = document.getElementById('repoGrid');
  grid.innerHTML = '';
  list.forEach((r) => {
    const color = LANG_COLORS[r.lang] || '#8b949e';
    const langBadge = r.lang
      ? '<span class="card-lang"><span class="lang-dot" style="background:' + color + '"></span>' + esc(r.lang) + '</span>'
      : '<span></span>';
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML =
      '<div class="card-head">' +
        langBadge +
        '<span class="card-meta">' +
          '<span>' + STAR_ICON + esc(r.stars) + '</span>' +
          '<span>' + FORK_ICON + esc(r.forks) + '</span>' +
        '</span>' +
      '</div>' +
      '<h3 class="card-title">' + esc(r.name) + '</h3>' +
      '<p class="card-text">' + esc(r.desc) + '</p>' +
      '<a class="card-link" href="' + esc(r.url) + '" target="_blank" rel="noopener">查看项目 ↗</a>';
    grid.appendChild(card);
  });
}

function setStats(repos, followers, stars, contrib) {
  document.getElementById('statRepos').textContent = repos;
  document.getElementById('statFollowers').textContent = followers;
  document.getElementById('statStars').textContent = stars;
  document.getElementById('statContrib').textContent = contrib;
}

async function fetchGitHub() {
  const user = CONFIG.githubUser;
  const uRes = await fetch('https://api.github.com/users/' + user);
  if (!uRes.ok) throw new Error('user not found');
  const u = await uRes.json();

  const rRes = await fetch('https://api.github.com/users/' + user + '/repos?per_page=100&sort=updated');
  const repos = rRes.ok ? await rRes.json() : [];
  const own = repos.filter((r) => !r.fork);
  const totalStars = own.reduce((s, r) => s + r.stargazers_count, 0);
  const top = [...own].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 9);

  let contrib = '—';
  try {
    const cRes = await fetch('https://github-contributions-api.jogruber.de/v4/' + user);
    const c = await cRes.json();
    // 接口返回 {"total": {"2026": 20}}，按年份取；个别旧格式 total 直接是数字
    const t = c && c.total;
    const y = String(new Date().getFullYear());
    const n = typeof t === 'number' ? t : (t && typeof t[y] === 'number' ? t[y] : undefined);
    if (typeof n === 'number') contrib = n;
    // 同一份数据顺便画贡献热力图
    if (c && Array.isArray(c.contributions)) renderHeatmap(c.contributions);
  } catch (e) { /* 拿不到就显示 — */ }

  setStats(u.public_repos, u.followers, totalStars, contrib);
  renderRepos(top.map((r) => ({
    name: r.name,
    lang: r.language || '',
    desc: r.description || '（这个仓库没有写简介）',
    stars: r.stargazers_count,
    forks: r.forks_count,
    url: r.html_url
  })));
  document.getElementById('githubLink').href = CONFIG.github;
}

function fallback(stats, repos) {
  setStats(stats.repos, stats.followers, stats.stars, stats.contrib);
  renderRepos(repos);
}

// GitHub 贡献热力图：按周分列（第一列按星期对齐留空），接口拿不到就不显示
function renderHeatmap(days) {
  const wrap = document.getElementById('heatmap');
  const box = document.getElementById('heatmapBox');
  if (!wrap || !box || !days.length) return;
  const pad = new Date(days[0].date + 'T00:00:00').getDay();
  let html = '';
  for (let i = 0; i < pad; i++) html += '<span class="hm-cell"></span>';
  days.forEach((d) => {
    const lv = Math.min(4, Math.max(0, d.level | 0));
    html += '<span class="hm-cell l' + lv + '" title="' + esc(d.date) + ' · ' + esc(d.count) + ' 次贡献"></span>';
  });
  wrap.innerHTML = html;
  box.hidden = false;
}

// 链接兜底
document.querySelectorAll('a[href="https://github.com/你的用户名"]').forEach((a) => { a.href = CONFIG.github; });
document.querySelectorAll('a[href="https://space.bilibili.com/你的uid"]').forEach((a) => { a.href = CONFIG.bilibili; });
document.querySelectorAll('a[href^="mailto:"]').forEach((a) => { a.href = 'mailto:' + CONFIG.email; });
document.getElementById('githubLink').href = CONFIG.github;

if (CONFIG.githubUser) {
  fetchGitHub().catch(() => fallback(STATS_FALLBACK, REPO_FALLBACK));
} else {
  fallback({ repos: '—', followers: '—', stars: '—', contrib: '—' }, PLACEHOLDER_REPOS);
}

// ===== 打字机效果 =====
function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el || !CONFIG.roles.length) return;
  // 系统开了"减少动态效果"就直接显示完整标签，不打字
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = CONFIG.roles[0];
    return;
  }
  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = CONFIG.roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      setTimeout(tick, 110);
    } else {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % CONFIG.roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 55);
    }
  }
  tick();
}
typewriter();

// ===== 页面交互（导航滚动阴影/移动端菜单在全站共用的 js/blog.js 里）=====

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.section').forEach((el) => {
  el.classList.add('reveal');
  observer.observe(el);
});

// 导航高亮：滚动到哪个区块，对应菜单项就亮起来
const navAnchors = [...document.querySelectorAll('.nav-links a')];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navAnchors.forEach((a) =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + id)
      );
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
['projects', 'about', 'blog', 'contact'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});
// 回到首屏时取消高亮
const heroEl = document.querySelector('.hero');
if (heroEl) {
  const heroSpy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove('active'));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  heroSpy.observe(heroEl);
}
