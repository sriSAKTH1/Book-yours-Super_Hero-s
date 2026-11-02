
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: true,

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },

  access: {
    read: ({ req, id }) =>
      req.user?.role === 'admin' ||
      (id != null && req.user?.id != null && String(req.user.id) === String(id)),
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req, id }) =>
      req.user?.role === 'admin' ||
      (id != null && req.user?.id != null && String(req.user.id) === String(id)),
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
    {
      name: 'appearanceFontSize',
      label: 'Admin font size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      admin: {
        description: 'Choose the text size used throughout the CMS admin panel.',
      },
    },
  ],
}
