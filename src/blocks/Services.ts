import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const ServicesBlock: Block = {
  slug: 'servicesGrid',
  labels: { singular: 'Services grid', plural: 'Services grids' },
  fields: [
    twoColumnRow(
      { name: 'heading', type: 'text', defaultValue: 'How we help' },
      { name: 'anchorId', type: 'text', label: 'Section anchor ID' },
    ),
    { name: 'intro', type: 'textarea' },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Services to show',
      admin: {
        description: 'Choose and reorder services for this section. Leave empty to show published services by display order.',
      },
    },
    twoColumnRow({ name: 'limit', type: 'number', defaultValue: 6, min: 1, max: 30 }),
  ],
}
