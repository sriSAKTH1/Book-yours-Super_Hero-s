import type { Block } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    twoColumnRow(
      { name: 'eyebrow', type: 'text' },
      { name: 'heading', type: 'text', required: true },
    ),
    { name: 'description', type: 'textarea' },
    twoColumnRow(
      { name: 'buttonLabel', type: 'text', defaultValue: 'Get in touch' },
      {
        name: 'buttonUrl', type: 'text', defaultValue: '/contact',
        admin: { components: { Field: '@/components/fields/NavigationURLField#NavigationURLField' } },
      },
    ),
  ],
}
