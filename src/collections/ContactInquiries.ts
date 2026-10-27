
import type { CollectionConfig } from 'payload'

export const ContactInquiries: CollectionConfig = {
  slug: 'contact-inquiries',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'status', 'createdAt'],
    group: 'Inquiries',
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    create: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      access: {
        read: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
        update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'editor',
      },
    },
  ],
}
