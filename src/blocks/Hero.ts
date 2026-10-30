import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero section', plural: 'Hero sections' },
  fields: [
    twoColumnRow(
      { name: 'eyebrow', type: 'text' },
      { name: 'heading', type: 'text', required: true },
    ),
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    twoColumnRow({ name: 'buttonLabel', type: 'text' }, {
      name: 'buttonUrl', type: 'text',
      admin: { components: { Field: '@/components/fields/NavigationURLField#NavigationURLField' } },
    }),
  ],
}
