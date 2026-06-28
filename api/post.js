// 게시글 공유용 Open Graph 서버리스 함수 — 경로 /post/:id 에서 동작
// index.html(SPA)을 그대로 내주되 글별 OG 태그만 주입한다.
// → 크롤러(카카오톡/페북/슬랙)는 글별 OG를 읽고, 사람은 깔끔한 /post/N 주소에서 SPA가 바로 글을 보여줌.

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

function imageUrl(ref) {
  if (!ref) return DEFAULT_IMAGE;
  const file = ref.replace(/^image-/, '').replace(/-(jpg|jpeg|png|gif|webp|svg)$/, '.$1');
  return `https://cdn.sanity.io/images/${PROJECT}/${DATASET}/${file}?w=1200&h=630&fit=crop&auto=format`;
}

function redirectFallback(id) {
  const spaUrl = `/#/post/${encodeURIComponent(id)}`;
  return `<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"/>
<script>location.replace(${JSON.stringify(spaUrl)});</script>
<meta http-equiv="refresh" content="0;url=${esc(spaUrl)}"/></head><body>이동 중…</body></html>`;
}

module.exports = async (req, res) => {
  const id = req.query && req.query.id ? String(req.query.id) : '';
  const isNum = /^\d+$/.test(id);
  const filter = isNum ? `postNumber == ${Number(id)}` : `_id == "${id.replace(/"/g, '')}"`;
  const groq = `*[_type=="post" && ${filter}][0]{title, "ref": mainImage.asset._ref}`;
  const apiUrl = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;

  // 글 정보 + SPA 셸을 병렬로 가져온다
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

  // 셸을 못 가져오면 안전 폴백(해시 리다이렉트)
  if (!shell) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(redirectFallback(id));
    return;
  }

  const ogTitle = esc(post && post.title ? post.title : '언러닝컴퍼니');
  const ogImage = esc(post ? imageUrl(post.ref) : DEFAULT_IMAGE);
  const shareUrl = esc(`${ORIGIN}/post/${id}`);
  const desc = esc(SUBCOPY);

  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${ogTitle} | 언러닝컴퍼니</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${desc}"/>`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${ogTitle}"/>`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${desc}"/>`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="article"/>`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${shareUrl}"/>`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${ogImage}"/>`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}"/>`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${shareUrl}"/>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
};
