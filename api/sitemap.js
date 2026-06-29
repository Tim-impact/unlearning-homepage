// 동적 sitemap — 정적 페이지 + 모든 게시글(/post/N)을 포함해 검색엔진 발견성을 높인다.
// /sitemap.xml 로 서빙 (vercel.json rewrite). robots.txt가 이 주소를 가리킴.

const PROJECT = 'n6aij3q3';
const DATASET = 'production';
const ORIGIN = 'https://un-learning.co';

module.exports = async (req, res) => {
  let posts = [];
  try {
    const groq = '*[_type=="post" && defined(postNumber)]{postNumber, _updatedAt} | order(postNumber asc)';
    const r = await fetch(
      `https://${PROJECT}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(groq)}`,
    );
    const j = await r.json();
    posts = Array.isArray(j.result) ? j.result : [];
  } catch (e) {
    /* 실패 시 정적 페이지만 내보냄 */
  }

  const urls = [
    { loc: ORIGIN + '/', changefreq: 'monthly', priority: '1.0' },
    { loc: ORIGIN + '/news', changefreq: 'weekly', priority: '0.8' },
    { loc: ORIGIN + '/blog', changefreq: 'weekly', priority: '0.8' },
    { loc: ORIGIN + '/curriculum', changefreq: 'monthly', priority: '0.6' },
  ];
  for (const p of posts) {
    if (p.postNumber == null) continue;
    urls.push({
      loc: `${ORIGIN}/post/${p.postNumber}`,
      lastmod: (p._updatedAt || '').slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
};
