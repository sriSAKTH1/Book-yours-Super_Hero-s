
import type { CollectionConfig } from 'payload'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'subscribedAt'],
    group: 'Inquiries',
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending Confirmation', value: 'pending' },
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
    },
    {
      name: 'subscribedAt',
      type: 'date',
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
    },
  ],
}
