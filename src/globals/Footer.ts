
import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',

  label: 'Superhero HQ Footer',

  admin: {
    group: 'Site Settings',
  },

  access: {
    read: () => true,
    update: ({ req }) =>
      req.user?.role === 'admin' || req.user?.role === 'editor',
  },

  fields: [
    {
      name: 'firmName',
      type: 'text',
      required: true,
      defaultValue: 'Superhero HQ',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'A trusted network of heroes, ready to rescue, protect, and rebuild.',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'footerLinks',
      type: 'array',
      label: 'Footer Links',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'X', value: 'x' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: 'All rights reserved.',
    },
  ],
}
