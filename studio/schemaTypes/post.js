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
      // News/Blog 목록에서 새 글을 만들 때 자동 지정되므로 에디터에서는 숨김
      hidden: true,
      initialValue: 'news',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postNumber',
      title: '글 번호',
      type: 'number',
      readOnly: true,
      description:
        '작성 순서대로 자동 부여되는 고유 번호 (URL에 사용). 한번 부여되면 다른 글을 삭제해도 바뀌지 않습니다.',
      // 새 글 생성 시 "현재 최대 번호 + 1"을 자동 부여 → 이후 읽기전용으로 고정
      initialValue: async (_, context) => {
        const client = context.getClient({apiVersion: '2024-01-01'})
        const max = await client.fetch(
          '*[_type == "post" && defined(postNumber)] | order(postNumber desc)[0].postNumber',
        )
        return (max || 0) + 1
      },
    }),
    defineField({
      name: 'category',
      title: '태그',
      type: 'array',
      of: [{type: 'string'}],
      description: '카드에 표시되는 분류. 정해진 목록에서 여러 개 선택할 수 있습니다 (선택).',
      options: {
        list: [
          {title: '공지', value: '공지'},
          {title: '프로그램', value: '프로그램'},
          {title: '후기', value: '후기'},
          {title: '칼럼', value: '칼럼'},
          {title: '인터뷰', value: '인터뷰'},
          {title: '사례', value: '사례'},
          {title: '일기', value: '일기'},
        ],
      },
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
      description:
        '목록 카드·상세 상단에 보이는 썸네일 (선택). 권장 크기: 가로 1600 × 세로 900 (16:9 비율), 가로 최소 1200px, 용량 2MB 이하.',
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
    select: {title: 'title', section: 'section', category: 'category', media: 'mainImage', postNumber: 'postNumber'},
    prepare: ({title, section, category, media, postNumber}) => {
      const tags = Array.isArray(category) ? category.join(', ') : category
      return {
        title,
        subtitle: [postNumber ? `#${postNumber}` : null, section === 'blog' ? 'Blog' : 'News', tags]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
