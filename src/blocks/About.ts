import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: 'About / mission', plural: 'About / mission sections' },
  fields: [
    twoColumnRow(
      { name: 'eyebrow', type: 'text', defaultValue: 'Our mission' },
      { name: 'heading', type: 'text', required: true },
    ),
    { name: 'body', type: 'richText', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'values',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}
