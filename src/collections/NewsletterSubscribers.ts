
import type { CollectionConfig } from 'payload'
import { twoColumnRow } from '../lib/twoColumnRow'

export const NewsletterSubscribers: CollectionConfig = {
  slug: 'newsletter-subscribers',

  admin: {
    useAsTitle: 'email',
    defaultColumns: ['status', 'email', 'subscribedAt'],
    group: 'Inquiries',
    components: { edit: { beforeDocumentControls: ['@/components/fields/CollectionStatusControl#CollectionStatusControl'] } },
  },

  access: {
    read: ({ req }) => req.user?.role === 'admin',
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },

  fields: [
    twoColumnRow(
      { name: 'email', type: 'email', required: true, unique: true, index: true },
      {
        name: 'status', type: 'select', required: true, defaultValue: 'pending',
        admin: { hidden: true },
        options: [
          { label: 'Pending Confirmation', value: 'pending' },
          { label: 'Subscribed', value: 'subscribed' },
          { label: 'Unsubscribed', value: 'unsubscribed' },
        ],
      },
    ),
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
