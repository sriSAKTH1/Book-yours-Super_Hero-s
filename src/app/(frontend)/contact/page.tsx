import ContactForm from '@/components/ContactForm'
import ConsultationForm from '@/components/ConsultationForm'
import PageBuilder from '@/components/PageBuilder'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const payload = await getPayloadClient()
  const [settings, contactPages] = await Promise.all([
    payload.findGlobal({ slug: 'firm-settings' }),
    payload.find({
      collection: 'pages',
      where: {
        and: [
          { slug: { equals: 'contact' } },
          { or: [{ _status: { equals: 'published' } }, { status: { equals: 'published' } }] },
        ],
      },
      limit: 1,
      depth: 0,
    }),
  ])
  const contactPage = contactPages.docs[0]

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
          <h2>{contactPage?.title || 'Contact Superhero HQ'}</h2>
          <p className="contact-card-copy">Required fields are marked with an asterisk.</p>
          <ContactForm />
        </section>
      </section>

      <section className="consultation-section">
        <div className="consultation-heading">
          <p className="eyebrow eyebrow-dark">Plan community support</p>
          <h2>Request hero support.</h2>
          <p>Tell us what your neighborhood needs and how our team can help.</p>
        </div>
        <section className="contact-card consultation-card">
          <ConsultationForm />
        </section>
      </section>

      {contactPage?.layout?.length ? <PageBuilder blocks={contactPage.layout} /> : null}
    </main>
  )
}
