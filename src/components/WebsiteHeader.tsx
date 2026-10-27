import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { siteBrand, supportLabel } from '@/lib/siteContent'

export default async function WebsiteHeader() {
  const payload = await getPayloadClient()
  const header = await payload.findGlobal({ slug: 'header', depth: 1 })
  const configuredLinks = header.navigation?.length ? header.navigation : [
    { id: 'services', label: 'Services', url: '/services', openInNewTab: false },
    { id: 'team', label: 'Superheroes', url: '/superheroes', openInNewTab: false },
  ]
  const links = configuredLinks
    .map((item) => {
      const isHome = /^home$/i.test(item.label) || /^\/home\/?$/i.test(item.url)
      const isContent = /^content$/i.test(item.label) || /^\/content\/?$/i.test(item.url)
      const isInsights = /^insights$/i.test(item.label) || /^\/insights\/?$/i.test(item.url)

      return {
        ...item,
        label: isHome
          ? 'Home'
          : isContent
            ? 'Contact'
            : isInsights
              ? 'Insights'
              : /developer|our team/i.test(item.label)
                ? 'Superheroes'
                : item.label,
        url: isHome
          ? '/'
          : isContent
            ? '/contact'
            : isInsights
              ? '/insights'
              : item.url.replace(/^\/developers(?=\/|$)/, '/superheroes'),
        openInNewTab: isContent ? false : item.openInNewTab,
      }
    })
    .filter((item, index, all) => all.findIndex((candidate) => candidate.url.replace(/\/+$/, '').toLowerCase() === item.url.replace(/\/+$/, '').toLowerCase()) === index)

  if (!links.some((item) => item.label.trim().toLowerCase() === 'home' || item.url.replace(/\/+$/, '').toLowerCase() === '/')) {
    links.unshift({ id: 'home', label: 'Home', url: '/', openInNewTab: false })
  }

  if (!links.some((item) => item.url.replace(/\/+$/, '').toLowerCase() === '/about')) {
    links.push({ id: 'about', label: 'About', url: '/about', openInNewTab: false })
  }

  if (!links.some((item) => item.label.trim().toLowerCase() === 'contact' || item.url.replace(/\/+$/, '').toLowerCase() === '/contact')) {
    links.push({ id: 'contact', label: 'Contact', url: '/contact', openInNewTab: false })
  }

  if (!links.some((item) => item.label.trim().toLowerCase() === 'insights' || item.url.replace(/\/+$/, '').toLowerCase() === '/insights')) {
    links.push({ id: 'insights', label: 'Insights', url: '/insights', openInNewTab: false })
  }

  const navigationOrder = ['home', 'about', 'services', 'superheroes', 'insights', 'contact']
  links.sort((a, b) => {
    const aOrder = navigationOrder.indexOf(a.label.trim().toLowerCase())
    const bOrder = navigationOrder.indexOf(b.label.trim().toLowerCase())
    return (aOrder === -1 ? navigationOrder.length : aOrder) - (bOrder === -1 ? navigationOrder.length : bOrder)
  })

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">✳</span>{siteBrand(header.logoText)}</Link>
        <nav className="header-nav" aria-label="Main navigation">
          {links.map((item) => <Link key={item.id ?? item.url} href={item.url} target={item.openInNewTab ? '_blank' : undefined} rel={item.openInNewTab ? 'noopener noreferrer' : undefined}>{item.label}</Link>)}
        </nav>
        <Link className="header-cta" href={header.ctaUrl || '/contact'}>{supportLabel(header.ctaLabel)} <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  )
}
