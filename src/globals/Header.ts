
import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',

  label: 'Website Header',

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
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'logoText',
      type: 'text',
      required: true,
      defaultValue: 'Superhero HQ',
    },
    {
      name: 'navigation',
      type: 'array',
      label: 'Navigation Links',
      defaultValue: [
        { label: 'Home', url: '/' },
        { label: 'Services', url: '/services' },
        { label: 'Superheroes', url: '/superheroes' },
        { label: 'Insights', url: '/insights' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
      ],
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
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Contact us',
     
    },
    {
      name: 'ctaUrl',
      type: 'text',
      defaultValue: '/contact',
      admin: { components: { Field: '@/components/fields/NavigationURLField#NavigationURLField' } },
    },
  ],
}
///
