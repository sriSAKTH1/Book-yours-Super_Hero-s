export function siteBrand(value?: string | null) {
  return !value || /payload|nextja/i.test(value) ? 'Superhero HQ' : value
}

export function supportLabel(value?: string | null) {
  return !value || /consultation|let.?s talk|talk to our team/i.test(value)
    ? 'Contact us'
    : value
}

export function servicePresentation(service: { slug: string; title: string; shortDescription: string }) {
  if (service.slug === 'technology-ai') {
    return {
      title: 'Emergency technology & mission control',
      shortDescription:
        'Coordinate alerts, response teams, and real-time community updates with dependable technology.',
    }
  }

  return { title: service.title, shortDescription: service.shortDescription }
}
