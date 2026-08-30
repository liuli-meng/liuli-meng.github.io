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
  document.getElementById('postBody').innerHTML = post.content;
}

// 按当前页面自动分派：有 postBody 就是阅读页，否则渲染列表（容器可带 data-limit 限制篇数）
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('postBody')) {
    renderPostPage();
  } else {
    const el = document.getElementById('postList');
    if (el) renderPostList(el, el.dataset.limit ? Number(el.dataset.limit) : undefined);
  }
});
