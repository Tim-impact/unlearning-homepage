import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'youtube',
  title: '유튜브',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: '유튜브 URL',
      type: 'url',
      description: '예: https://www.youtube.com/watch?v=...',
    }),
  ],
  preview: {
    select: {url: 'url'},
    prepare: ({url}) => ({title: '유튜브 영상', subtitle: url}),
  },
})
