'use client'

import { useState, type FormEvent } from 'react'
import type { Form } from '@/payload-types'

type FormField = NonNullable<Form['fields']>[number]
const requiredContactFields = new Set(['name', 'email', 'message'])

function isSupportedField(field: FormField): field is Extract<FormField, { blockType: 'text' | 'email' | 'textarea' }> {
  return field.blockType === 'text' || field.blockType === 'email' || field.blockType === 'textarea'
}

export default function FormBuilderTest({ form }: { form: Form }) {
  const fields = (form.fields ?? []).filter(isSupportedField)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const values = new FormData(formElement)
    const submissionData = fields.map((field) => ({
      field: field.name,
      value: String(values.get(field.name) ?? '').trim(),
    }))

    if (submissionData.some(({ field, value }) => {
      const definition = fields.find((item) => item.name === field)
      return (definition?.required || requiredContactFields.has(field)) && !value
    })) {
      setSuccess(false)
      setFeedback('Please complete all required fields.')
      return
    }

    setLoading(true)
    setFeedback('')
    setSuccess(false)

    try {
      const valuesByName = Object.fromEntries(submissionData.map(({ field, value }) => [field, value]))
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: valuesByName.name,
          email: valuesByName.email,
          phone: valuesByName.phone ?? '',
          subject: valuesByName.subject || 'Website contact inquiry',
          message: valuesByName.message || submissionData.map(({ field, value }) => `${field}: ${value}`).join('\n'),
        }),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(typeof result?.errors?.[0]?.message === 'string'
          ? result.errors[0].message
          : typeof result?.message === 'string' ? result.message : 'Submission failed.')
      }

      setSuccess(true)
      setFeedback('Thank you! Your message has been received.')
      formElement.reset()
    } catch {
      setFeedback('Unable to send your message right now. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  if (!fields.length) {
    return <p role="alert" className="form-error">This saved form has no supported text, email, or textarea fields.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="submission-form" aria-busy={loading}>
      {fields.map((field) => {
        const label = field.label || field.name
        const id = `form-builder-${field.name}`
        const controlProps = {
          id,
          name: field.name,
          required: Boolean(field.required) || requiredContactFields.has(field.name),
          className: 'form-control',
          style: { width: '100%' },
          'aria-describedby': feedback && !success ? 'form-builder-error' : undefined,
        }

        return (
          <div key={field.id ?? field.name} style={{ width: '100%' }}>
            <label htmlFor={id}>{label}{controlProps.required ? ' *' : ''}</label>
            {field.blockType === 'textarea' ? (
              <textarea {...controlProps} rows={5} defaultValue={field.defaultValue ?? ''} />
            ) : (
              <input
                {...controlProps}
                type={field.blockType === 'email' ? 'email' : 'text'}
                autoComplete={field.name === 'name' ? 'name' : field.name === 'email' ? 'email' : undefined}
                defaultValue={field.blockType === 'text' ? field.defaultValue ?? '' : undefined}
              />
            )}
          </div>
        )
      })}

      {feedback && (
        <p
          id={success ? undefined : 'form-builder-error'}
          role={success ? 'status' : 'alert'}
          aria-live={success ? 'polite' : 'assertive'}
          className={success ? 'form-notice' : 'form-error'}
        >
          {feedback}
        </p>
      )}

      <button type="submit" disabled={loading} className="button button-dark">
        {loading ? 'Submitting...' : 'Send Message'}
      </button>
    </form>
  )
}
