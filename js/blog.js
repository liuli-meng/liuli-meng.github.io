// ===== 博客页面共用逻辑（依赖 js/posts.js 的 window.POSTS）=====

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function sortedPosts() {
  return [...(window.POSTS || [])].sort((a, b) => b.date.localeCompare(a.date));
}

function postHref(slug) {
  return 'post.html?slug=' + encodeURIComponent(slug);
}

// ===== 文章评论（giscus，数据存在 GitHub Discussions 里）=====
// 仓库已开启 Discussions 并建好配置；唯一手动步骤：在 https://github.com/apps/giscus
// 安装 App 并授权 liuli-meng.github.io 仓库，评论才会真正可用。
// 不想要评论就把 enabled 改为 false。
const COMMENTS = {
  enabled: true,
  repo: 'liuli-meng/liuli-meng.github.io',
  repoId: 'R_kgDOUIApBw',
  category: 'General',
  categoryId: 'DIC_kwDOUIApB84DE_Jt',
};

function setupComments() {
  const box = document.getElementById('comments');
  if (!box || box.hasChildNodes()) return;
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.setAttribute('data-repo', COMMENTS.repo);
  s.setAttribute('data-repo-id', COMMENTS.repoId);
  s.setAttribute('data-category', COMMENTS.category);
  s.setAttribute('data-category-id', COMMENTS.categoryId);
  s.setAttribute('data-mapping', 'pathname');
  s.setAttribute('data-strict', '0');
  s.setAttribute('data-reactions-enabled', '1');
  s.setAttribute('data-emit-metadata', '0');
  s.setAttribute('data-input-position', 'top');
  s.setAttribute('data-theme', 'transparent_dark');
  s.setAttribute('data-lang', 'zh-CN');
  // 先隐藏，等 giscus 真正加载好再显示：没装 App / 网络不通时不留一块空白
  box.hidden = true;
  window.addEventListener('message', function onGiscus(e) {
    if (e.origin !== 'https://giscus.app') return;
    box.hidden = false;
    window.removeEventListener('message', onGiscus);
  });
  box.appendChild(s);
}

// 渲染文章列表（limit 传数字则只显示前几篇，首页用）
function renderPostList(el, limit) {
  if (!el) return;
  const list = limit ? sortedPosts().slice(0, limit) : sortedPosts();
  el.innerHTML = '';
  if (!list.length) {
    el.innerHTML = '<p class="post-excerpt">还没有文章，去 js/posts.js 里写第一篇吧。</p>';
    return;
  }
  list.forEach((p) => {
    const item = document.createElement('article');
    item.className = 'post-item';
    item.innerHTML =
      '<div class="post-meta mono"><time>' + esc(p.date) + '</time><span>' + esc(p.tags.join(' · ')) + '</span></div>' +
      '<h3 class="post-title"><a href="' + postHref(p.slug) + '">' + esc(p.title) + '</a></h3>' +
      '<p class="post-excerpt">' + esc(p.excerpt) + ' <a class="more" href="' + postHref(p.slug) + '">阅读全文 →</a></p>';
    el.appendChild(item);
  });
}

// 渲染文章阅读页（post.html?slug=xxx）
function renderPostPage() {
  const slug = new URLSearchParams(location.search).get('slug');
  const post = sortedPosts().find((p) => p.slug === slug);
  const titleEl = document.getElementById('postTitle');
  if (!post) {
    document.title = '文章不存在 · 琉璃';
    titleEl.textContent = '文章不存在';
    document.getElementById('postBody').innerHTML =
      '<p>没有找到这篇文章，<a href="blog.html">回文章列表</a>看看别的吧。</p>';
    document.getElementById('postMeta').textContent = '';
    return;
  }
  document.title = post.title + ' · 琉璃';
  titleEl.textContent = post.title;
  document.getElementById('postMeta').textContent = post.date + ' · ' + post.tags.join(' / ');
  const body = document.getElementById('postBody');
  body.innerHTML = post.content;

  // 阅读时长：中文按每分钟 400 字估算
  const minutes = Math.max(1, Math.round(body.textContent.length / 400));
  document.getElementById('postMeta').textContent =
    post.date + ' · ' + post.tags.join(' / ') + ' · 约 ' + minutes + ' 分钟';

  // 目录：给 h2 编号生成锚点列表
  const heads = body.querySelectorAll('h2');
  const tocBox = document.getElementById('toc');
  const tocLinks = document.getElementById('tocLinks');
  if (heads.length >= 2 && tocBox && tocLinks) {
    let html = '';
    heads.forEach((h, i) => {
      h.id = 'sec-' + i;
      html += '<a href="#sec-' + i + '">' + esc(h.textContent) + '</a>';
    });
    tocLinks.innerHTML = html;
    tocBox.hidden = false;
    setupTocSpy(heads, tocLinks);
  }

  // 上一篇（更早）/ 下一篇（更新）
  const all = sortedPosts();
  const idx = all.indexOf(post);
  const nav = document.getElementById('postNav');
  if (nav) {
    const older = all[idx + 1];
    const newer = idx > 0 ? all[idx - 1] : null;
    nav.innerHTML =
      (older
        ? '<a class="pn" href="' + postHref(older.slug) + '"><span class="pn-label mono">← 上一篇</span><strong>' + esc(older.title) + '</strong></a>'
        : '<span></span>') +
      (newer
        ? '<a class="pn next" href="' + postHref(newer.slug) + '"><span class="pn-label mono">下一篇 →</span><strong>' + esc(newer.title) + '</strong></a>'
        : '');
  }

  // 代码块右上角复制按钮
  body.querySelectorAll('pre').forEach((pre) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const btn = document.createElement('button');
    btn.className = 'copy-btn mono';
    btn.type = 'button';
    btn.textContent = '复制';
    btn.addEventListener('click', async () => {
      const text = pre.innerText.trim();
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '已复制 ✓';
      } catch (e) {
        // 降级：file:// 等非安全上下文下新剪贴板 API 不可用，走 execCommand
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          btn.textContent = '已复制 ✓';
        } catch (err) {
          btn.textContent = '复制失败';
        }
        ta.remove();
      }
      setTimeout(() => { btn.textContent = '复制'; }, 1600);
    });
    wrap.appendChild(btn);
  });

  // 动态更新分享卡片信息
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogTitle) ogTitle.setAttribute('content', post.title);
  if (ogDesc) ogDesc.setAttribute('content', post.excerpt);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://liuli-meng.github.io/post.html?slug=' + encodeURIComponent(post.slug));

  // 评论区（giscus）
  if (COMMENTS.enabled) setupComments();
}

// 目录高亮：滚动到哪一节，目录里对应项亮起
function setupTocSpy(heads, tocLinks) {
  const links = [...tocLinks.querySelectorAll('a')];
  if (!links.length) return;
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id)
        );
      });
    },
    { rootMargin: '-80px 0px -70% 0px' }
  );
  heads.forEach((h) => spy.observe(h));
}

// 返回顶部按钮（滚动一段距离后出现）
function setupBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.hidden = false;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== 全站导航：滚动阴影 + 移动端菜单（三个页面共用，主页的区块高亮仍由 main.js 负责）=====
const siteNav = document.getElementById('nav');
if (siteNav) {
  window.addEventListener('scroll', () => {
    siteNav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// 按当前页面自动分派：有 postBody 就是阅读页，否则渲染列表（容器可带 data-limit 限制篇数）
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const count = document.getElementById('postCount');
  if (count) count.textContent = (window.POSTS || []).length;

  setupBackTop();
  if (document.getElementById('postBody')) {
    renderPostPage();
  } else {
    const el = document.getElementById('postList');
    if (el) renderPostList(el, el.dataset.limit ? Number(el.dataset.limit) : undefined);
  }
});
