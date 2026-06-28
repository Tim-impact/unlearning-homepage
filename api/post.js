// 게시글 공유용 Open Graph 서버리스 함수 — 경로 /post/:id 에서 동작
// 크롤러(카카오톡/페이스북/슬랙)는 글별 OG 태그를 읽고, 사람은 SPA(#/post/:id)로 리다이렉트된다.

const PROJECT = 'n6aij3q3';
const DATASET = 'production';
const SUBCOPY = '언러닝컴퍼니 | 사회혁신조직이 미션에만 몰입할 수 있도록.';
const DEFAULT_IMAGE = 'https://un-learning.co/og-image.png';

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

module.exports = async (req, res) => {
  const id = req.query && req.query.id ? String(req.query.id) : '';
  const isNum = /^\d+$/.test(id);
  const filter = isNum ? `postNumber == ${Number(id)}` : `_id == "${id.replace(/"/g, '')}"`;
  const groq = `*[_type=="post" && ${filter}][0]{title, "ref": mainImage.asset._ref}`;
  const apiUrl = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`;

  let post = null;
  try {
    const r = await fetch(apiUrl);
    const j = await r.json();
    post = j.result;
  } catch (e) {
    post = null;
  }

  const ogTitle = esc(post && post.title ? post.title : '언러닝컴퍼니');
  const ogImage = esc(post ? imageUrl(post.ref) : DEFAULT_IMAGE);
  const shareUrl = esc(`https://un-learning.co/post/${id}`);
  const spaUrl = `/#/post/${encodeURIComponent(id)}`;

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${ogTitle} | 언러닝컴퍼니</title>
<meta name="description" content="${esc(SUBCOPY)}"/>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${ogTitle}"/>
<meta property="og:description" content="${esc(SUBCOPY)}"/>
<meta property="og:image" content="${ogImage}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:url" content="${shareUrl}"/>
<meta property="og:site_name" content="언러닝컴퍼니"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${ogTitle}"/>
<meta name="twitter:description" content="${esc(SUBCOPY)}"/>
<meta name="twitter:image" content="${ogImage}"/>
<link rel="canonical" href="${shareUrl}"/>
<script>location.replace(${JSON.stringify(spaUrl)});</script>
<meta http-equiv="refresh" content="0;url=${esc(spaUrl)}"/>
</head>
<body style="font-family:sans-serif;color:#888;padding:40px;text-align:center">이동 중…</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
};
