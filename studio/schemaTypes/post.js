import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: '글',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (Rule) => Rule.required().error('제목을 입력하세요'),
    }),
    defineField({
      name: 'section',
      title: '메뉴 구분',
      type: 'string',
      description: 'News(공지사항) / Blog(후기·칼럼 등 콘텐츠) 중 어느 메뉴에 노출할지',
      options: {
        list: [
          {title: 'News — 공지사항', value: 'news'},
          {title: 'Blog — 콘텐츠(후기·칼럼 등)', value: 'blog'},
        ],
        layout: 'radio',
      },
      initialValue: 'news',
      validation: (Rule) => Rule.required().error('메뉴 구분을 선택하세요'),
    }),
    defineField({
      name: 'category',
      title: '태그',
      type: 'string',
      description: '카드에 표시되는 작은 분류 (예: 공지, 후기, 칼럼, 인터뷰) — 선택',
    }),
    defineField({
      name: 'publishedAt',
      title: '발행일',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required().error('발행일을 지정하세요'),
    }),
    defineField({
      name: 'mainImage',
      title: '대표 이미지',
      type: 'image',
      description: '목록 카드와 상세 상단에 보이는 썸네일 (선택)',
      options: {hotspot: true},
    }),
    defineField({
      name: 'body',
      title: '본문',
      type: 'blockContent',
    }),
  ],
  orderings: [
    {
      title: '발행일 최신순',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', section: 'section', category: 'category', media: 'mainImage'},
    prepare: ({title, section, category, media}) => ({
      title,
      subtitle: [section === 'blog' ? 'Blog' : 'News', category].filter(Boolean).join(' · '),
      media,
    }),
  },
})
