import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Content 단계에서 News / Blog 게시판을 나눠서 보여준다
const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('news')
        .title('News — 공지사항')
        .child(
          S.documentList()
            .title('News')
            .filter('_type == "post" && section == "news"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .initialValueTemplates([S.initialValueTemplateItem('post-news')]),
        ),
      S.listItem()
        .id('blog')
        .title('Blog — 콘텐츠(후기·칼럼)')
        .child(
          S.documentList()
            .title('Blog')
            .filter('_type == "post" && section == "blog"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
            .initialValueTemplates([S.initialValueTemplateItem('post-blog')]),
        ),
    ])

export default defineConfig({
  name: 'default',
  title: '언러닝컴퍼니 블로그',

  projectId: 'n6aij3q3',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // 각 게시판에서 새 글을 만들면 해당 section이 자동 지정된다
    templates: [
      {id: 'post-news', title: 'News 글', schemaType: 'post', value: {section: 'news'}},
      {id: 'post-blog', title: 'Blog 글', schemaType: 'post', value: {section: 'blog'}},
    ],
  },
})
