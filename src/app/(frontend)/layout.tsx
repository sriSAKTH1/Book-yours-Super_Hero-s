import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import './ui.css'
import WebsiteHeader from '@/components/WebsiteHeader'
import WebsiteFooter from '@/components/WebsiteFooter'
import { getPublicSiteURL } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: getPublicSiteURL() || undefined,
  title: {
    default: 'Superhero HQ — Help when the city needs it',
    template: '%s | Superhero HQ',
  },
  description:
    'Meet the heroes protecting our city and explore rescue, protection, and recovery services.',
  openGraph: {
    title: 'Superhero HQ — Help when the city needs it',
    description: 'Explore hero services, meet the superheroes, and get help when it matters.',
    siteName: 'Superhero HQ',
    type: 'website',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <WebsiteHeader />
        {children}
        <WebsiteFooter />
      </body>
    </html>
  )
}
