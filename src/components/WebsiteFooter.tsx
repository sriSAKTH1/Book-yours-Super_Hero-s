import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import NewsletterForm from '@/components/NewsletterForm'
import { siteBrand } from '@/lib/siteContent'

export default async function WebsiteFooter() {
  const payload = await getPayloadClient()
  const footer = await payload.findGlobal({ slug: 'footer', depth: 1 })
  const links = footer.footerLinks?.length
    ? footer.footerLinks
    : [
        { id: 'services', label: 'Services', url: '/services' },
        { id: 'team', label: 'Superheroes', url: '/superheroes' },
        { id: 'about', label: 'About', url: '/about' },
        { id: 'insights', label: 'Insights', url: '/insights' },
      ]

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <Link href="/" className="footer-brand">
            {siteBrand(footer.firmName)}
          </Link>
          <p className="footer-description">
            {!footer.description || /digital products|technology services|nextja/i.test(footer.description)
              ? 'A trusted network of heroes, ready to rescue, protect, and rebuild.'
              : footer.description}
          </p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          {links.map((item) => (
            <Link key={item.id ?? item.url} href={item.url.replace(/^\/developers(?=\/|$)/, '/superheroes')}>
              {/developer|our team/i.test(item.label) ? 'Superheroes' : item.label}
            </Link>
          ))}
        </nav>
        <div className="footer-contact">
          {footer.email && !/payload@cms\.com/i.test(footer.email) && <a href={`mailto:${footer.email}`}>{footer.email}</a>}
          {footer.phone && footer.phone.replace(/\D/g, '') !== '9876543210' && <a href={`tel:${footer.phone}`}>{footer.phone}</a>}
        </div>
        <NewsletterForm />
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} {siteBrand(footer.firmName)}.{' '}
        {footer.copyrightText || 'All rights reserved.'}
      </div>
    </footer>
  )
}
