import type { Block } from 'payload'

export const FAQsBlock: Block = {
  slug: 'faqSection',
  labels: { singular: 'FAQ section', plural: 'FAQ sections' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Questions, answered.' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      label: 'Questions and answers',
      admin: {
        description: 'Add, remove, and reorder questions directly in this section.',
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'richText', required: true },
      ],
    },
  ],
}
