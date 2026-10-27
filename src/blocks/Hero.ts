import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero section', plural: 'Hero sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
  ],
}
