// 게시글 공유/SEO/GEO 서버리스 함수 — 경로 /post/:id 에서 동작
// index.html(SPA)을 내주되 글별 메타(OG)·본문(크롤러용 noscript)·BlogPosting JSON-LD를 주입한다.
// → 크롤러·AI봇(JS 미실행)은 본문·구조화 데이터를 읽고, 사람은 깔끔한 /post/N 주소에서 SPA가 글을 렌더.

const PROJECT = 'n6aij3q3';
const DATASET = 'production';
const ORIGIN = 'https://un-learning.co';
const SUBCOPY = '언러닝컴퍼니 | 사회혁신조직이 미션에만 몰입할 수 있도록.';
const DEFAULT_IMAGE = ORIGIN + '/og-image.png';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sanityImg(ref, params) {
  if (!ref) return null;
  const file = ref.replace(/^image-/, '').replace(/-(jpg|jpeg|png|gif|webp|svg)$/, '.$1');
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${file}?${params}`;
}

function blockText(b) {
  return (b.children || []).map((c) => (c && c.text) || '').join('').replace(/ /g, ' ').trim();
}

// 본문 전체를 평문으로 (JSON-LD articleBody용)
function blocksToText(body) {
  if (!Array.isArray(body)) return '';
  return body
    .filter((b) => b && b._type === 'block' && Array.isArray(b.children))
    .map(blockText)
    .filter(Boolean)
    .join('\n\n');
}

// 설명용: 일반 문단(heading 제외) 우선
function descFromBody(body) {
  if (!Array.isArray(body)) return '';
  return body
    .filter((b) => b && b._type === 'block' && (!b.style || b.style === 'normal') && Array.isArray(b.children))
    .map(blockText)
    .filter(Boolean)
    .join(' ');
}

function summarize(text, n) {
  const s = (text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}

// 본문을 단순·안전한 HTML로 (<noscript> — JS 없는 크롤러용)
function blocksToHtml(body) {
  if (!Array.isArray(body)) return '';
  const out = [];
  for (const b of body) {
    if (!b) continue;
    if (b._type === 'image' && b.asset && b.asset._ref) {
      const u = sanityImg(b.asset._ref, 'w=1000&auto=format');
      if (u) out.push(`<img src="${esc(u)}" alt="" loading="lazy" />`);
      continue;
    }
    if (b._type !== 'block' || !Array.isArray(b.children)) continue;
    const t = esc(blockText(b));
    if (!t) continue;
    switch (b.style) {
      case 'h1':
      case 'h2': out.push(`<h2>${t}</h2>`); break;
      case 'h3': out.push(`<h3>${t}</h3>`); break;
      case 'h4': out.push(`<h4>${t}</h4>`); break;
      case 'blockquote': out.push(`<blockquote>${t}</blockquote>`); break;
      default: out.push(`<p>${t}</p>`);
    }
  }
  return out.join('\n');
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  } catch (e) {
    return '';
  }
}

function redirectFallback(id) {
  const spaUrl = `/#/post/${encodeURIComponent(id)}`;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/>
<script>location.replace(${JSON.stringify(spaUrl)});</script>
<meta http-equiv="refresh" content="0;url=${esc(spaUrl)}"/></head><body>이동 중…</body></html>`;
}

module.exports = async (req, res) => {
  const rawId = req.query && req.query.id ? String(req.query.id) : '';
  const isNum = /^\d+$/.test(rawId);
  const safeId = rawId.replace(/[\\"]/g, ''); // GROQ 문자열 이스케이프(따옴표·역슬래시 제거)
  const filter = isNum ? `postNumber == ${Number(rawId)}` : `_id == "${safeId}"`;
  const groq = `*[_type=="post" && ${filter}][0]{title, publishedAt, _updatedAt, section, category, "ref": mainImage.asset._ref, body}`;
  const apiUrl = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;

  let post = null;
  let shell = null;
  try {
    const [pRes, sRes] = await Promise.all([
      fetch(apiUrl).then((r) => r.json()).catch(() => null),
      fetch(ORIGIN + '/index.html').then((r) => r.text()).catch(() => null),
    ]);
    post = pRes && pRes.result ? pRes.result : null;
    shell = sRes;
  } catch (e) {
    /* noop */
  }

  if (!shell) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(redirectFallback(rawId));
    return;
  }

  const title = post && post.title ? post.title : '언러닝컴퍼니';
  const ogTitle = esc(title);
  const ogImageRaw = post && post.ref ? sanityImg(post.ref, 'w=1200&h=630&fit=crop&auto=format') : DEFAULT_IMAGE;
  const ogImage = esc(ogImageRaw);
  const shareUrl = esc(`${ORIGIN}/post/${rawId}`);

  const descRaw = summarize(descFromBody(post && post.body) || blocksToText(post && post.body), 155) || SUBCOPY;
  const desc = esc(descRaw);

  // BlogPosting 구조화 데이터 (SEO 리치결과 + GEO 인용)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: descRaw,
    image: ogImageRaw,
    datePublished: post && post.publishedAt ? post.publishedAt : undefined,
    dateModified: post ? post._updatedAt || post.publishedAt : undefined,
    author: { '@type': 'Organization', name: '언러닝컴퍼니', url: ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: '언러닝컴퍼니',
      logo: { '@type': 'ImageObject', url: ORIGIN + '/favicon.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${ORIGIN}/post/${rawId}` },
    inLanguage: 'ko-KR',
    articleBody: blocksToText(post && post.body) || undefined,
  };
  if (post && Array.isArray(post.category) && post.category.length) ld.keywords = post.category.join(', ');
  const ldScript = `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;

  // 크롤러용 본문 (JS 없을 때만 노출 — JS 사용자는 React가 #root에 렌더)
  let noscript = '';
  if (post) {
    const dateHtml = post.publishedAt
      ? `<p><time datetime="${esc(post.publishedAt)}">${esc(formatDate(post.publishedAt))}</time></p>`
      : '';
    const imgHtml = post.ref ? `<img src="${esc(sanityImg(post.ref, 'w=1200&auto=format'))}" alt="${ogTitle}" />` : '';
    noscript = `<noscript><article><h1>${ogTitle}</h1>${dateHtml}${imgHtml}${blocksToHtml(post.body)}</article></noscript>`;
  }

  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${ogTitle} | 언러닝컴퍼니</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${desc}"/>`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${ogTitle}"/>`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}"/>`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article"/>`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${shareUrl}"/>`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${ogImage}"/>`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}"/>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${shareUrl}"/>`)
    .replace(/<\/head>/, `${ldScript}</head>`)
    .replace('<div id="root">', `${noscript}<div id="root">`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
};
