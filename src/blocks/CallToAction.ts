import type { Block } from 'payload'

export const CallToActionBlock: Block = {
  slug: 'callToAction',
  labels: { singular: 'Call to action', plural: 'Calls to action' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Get in touch' },
    { name: 'buttonUrl', type: 'text', defaultValue: '/contact' },
  ],
}
