import type { Block } from 'payload'

export const ImageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image and text', plural: 'Image and text sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'richText', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'imageSide',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Right', value: 'right' },
        { label: 'Left', value: 'left' },
      ],
    },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonUrl', type: 'text' },
  ],
}
