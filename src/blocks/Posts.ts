import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const PostsBlock: Block = {
  slug: 'postsGrid',
  labels: { singular: 'Insights / posts grid', plural: 'Insights / posts grids' },
  fields: [
    twoColumnRow(
      { name: 'heading', type: 'text', defaultValue: 'Latest insights' },
      { name: 'anchorId', type: 'text', label: 'Section anchor ID' },
    ),
    { name: 'intro', type: 'textarea' },
    { name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 50 },
  ],
}
