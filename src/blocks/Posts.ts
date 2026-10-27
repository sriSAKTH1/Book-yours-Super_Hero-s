import type { Block } from 'payload'

export const PostsBlock: Block = {
  slug: 'postsGrid',
  labels: { singular: 'Insights / posts grid', plural: 'Insights / posts grids' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Latest insights' },
    { name: 'intro', type: 'textarea' },
    { name: 'anchorId', type: 'text', label: 'Section anchor ID' },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 50 },
  ],
}
