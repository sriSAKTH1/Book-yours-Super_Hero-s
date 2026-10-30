import FormBuilderTest from '@/components/FormBuilderTest'
import { getPayloadClient } from '@/lib/payload'
import type { Form } from '@/payload-types'

export const dynamic = 'force-dynamic'

export default async function FormBuilderTestPage() {
  let form: Form | undefined

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'forms',
      where: { title: { equals: 'Contact Us Test' } },
      limit: 1,
      depth: 0,
    })
    form = result.docs[0]
  } catch (error) {
    console.error('Could not load Contact Us Test form:', error)
  }

  return (
    <main>
      <section className="contact-page">
        <div className="contact-intro">
          <p className="eyebrow eyebrow-dark">Payload Form Builder</p>
          <h1>Test your saved contact form.</h1>
          <p>This temporary page renders the form saved in Payload Admin.</p>
        </div>
        <section className="contact-card" aria-labelledby="form-builder-test-title">
          <h2 id="form-builder-test-title">Contact Us Test</h2>
          <p className="contact-card-copy">Required fields are marked with an asterisk.</p>
          {form ? (
            <FormBuilderTest form={form} />
          ) : (
            <p role="alert" className="form-error">
              Could not find the “Contact Us Test” form. Confirm that it is saved in Payload Admin and that MongoDB is available.
            </p>
          )}
        </section>
      </section>
    </main>
  )
}
