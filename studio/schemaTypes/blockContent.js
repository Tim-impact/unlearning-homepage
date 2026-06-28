import {defineType, defineArrayMember} from 'sanity'

// 홈페이지 블로그 렌더러가 지원하는 항목에 맞춤:
// - 문단/제목2~4/인용, 굵게·기울임·밑줄·링크, 이미지, 유튜브
export default defineType({
  name: 'blockContent',
  title: '본문',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: '본문', value: 'normal'},
        {title: '제목 2', value: 'h2'},
        {title: '제목 3', value: 'h3'},
        {title: '제목 4', value: 'h4'},
        {title: '인용', value: 'blockquote'},
      ],
      lists: [],
      marks: {
        decorators: [
          {title: '굵게', value: 'strong'},
          {title: '기울임', value: 'em'},
          {title: '밑줄', value: 'underline'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: '링크',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: '이미지',
      options: {hotspot: true},
    }),
    defineArrayMember({type: 'youtube'}),
  ],
})
