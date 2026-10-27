import { permanentRedirect } from 'next/navigation'

type Props = { params: Promise<{ slug: string }> }

export default async function DeveloperAliasPage({ params }: Props) {
  const { slug } = await params
  permanentRedirect(`/superheroes/${encodeURIComponent(slug)}`)
}
