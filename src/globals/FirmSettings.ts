
import type { GlobalConfig } from 'payload'

export const FirmSettings: GlobalConfig = {
  slug: 'firm-settings',

  label: 'Hero Network Settings',

  admin: {
    group: 'Site Settings',
  },

  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'firmName',
      type: 'text',
      required: true,
      defaultValue: 'Superhero HQ',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Here when the city needs us',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'primaryPhone',
      type: 'text',
    },
    {
      name: 'primaryEmail',
      type: 'email',
    },
    {
      name: 'officeAddress',
      type: 'textarea',
    },
    {
      name: 'businessHours',
      type: 'array',
      fields: [
        {
          name: 'day',
          type: 'text',
          required: true,
        },
        {
          name: 'hours',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'consultationLabel',
      type: 'text',
      defaultValue: 'Request hero support',
    },
    {
      name: 'consultationUrl',
      type: 'text',
      defaultValue: '/contact',
    },
  ],
}
