import type { Metadata } from 'next'
import FormBuilderTest from '@/components/FormBuilderTest'
import PageBuilder from '@/components/PageBuilder'
import { getPayloadClient } from '@/lib/payload'
import { getPublicPageBySlug, pageMetadata } from '@/lib/seo'
import type { Form } from '@/payload-types'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getPublicPageBySlug('contact'), '/contact', 'Contact Superhero HQ', 'Contact our team about service requests, partnerships, and community support.')
}

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const [settings, contactPage, contactFormResult] = await Promise.all([
    payload.findGlobal({ slug: 'firm-settings' }),
    getPublicPageBySlug('contact'),
    payload.find({
      collection: 'forms',
      where: { title: { equals: 'Contact Us Test' } },
      limit: 1,
      depth: 0,
    }).catch((error) => {
      console.error('Could not load the saved contact form:', error)
      return null
    }),
  ])
  const contactForm = contactFormResult?.docs[0] as Form | undefined

  return (
    <main>
      <section className="contact-page">
        <div className="contact-intro">
          <p className="eyebrow eyebrow-dark">Contact the hero network</p>
          <h1>{contactPage?.heroTitle || 'Tell us where help is needed.'}</h1>
          <p>{contactPage?.heroDescription || 'For service requests, community partnerships, or general questions, send our team a message.'}</p>
          {settings.primaryEmail && !/payload@cms\.com/i.test(settings.primaryEmail) && <a className="contact-email" href={`mailto:${settings.primaryEmail}`}>{settings.primaryEmail}</a>}
          {settings.primaryPhone && settings.primaryPhone.replace(/\D/g, '') !== '9876543210' && <a className="contact-detail" href={`tel:${settings.primaryPhone}`}>{settings.primaryPhone}</a>}
          {settings.officeAddress && <p className="contact-address">{settings.officeAddress}</p>}
        </div>
        <section className="contact-card">
          <h2>Send us a message</h2>
          <p className="contact-card-copy">Required fields are marked with an asterisk.</p>
          {contactForm ? (
            <FormBuilderTest form={contactForm} />
          ) : (
            <p role="alert" className="form-error">The contact form is unavailable right now. Please try again later.</p>
          )}
        </section>
      </section>

      {contactPage?.layout?.length ? <PageBuilder blocks={contactPage.layout} /> : null}
    </main>
  )
}
