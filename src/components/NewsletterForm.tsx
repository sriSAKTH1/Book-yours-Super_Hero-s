'use client'

import { useState, type FormEvent } from 'react'

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback('')
    setSuccess(false)
    const form = event.currentTarget
    const values = new FormData(form)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
      const response = await fetch(`${apiUrl}/newsletter-subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(values.get('email') ?? ''), consent: values.get('consent') === 'on' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Subscription failed.')
      setSuccess(true)
      setFeedback('Thanks for subscribing.')
      form.reset()
    } catch {
      setFeedback('Unable to subscribe right now. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="newsletter-form" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email">Get updates from the hero network</label>
      <div className="newsletter-input-row"><input id="newsletter-email" name="email" type="email" placeholder="Your email address" maxLength={254} autoComplete="email" required /><button type="submit" disabled={loading} aria-label="Subscribe to the newsletter">{loading ? '…' : '↗'}</button></div>
      <label className="newsletter-consent"><input name="consent" type="checkbox" required /> I agree to receive email updates.</label>
      {feedback && <p className={success ? 'form-notice' : 'form-error'} role="status" aria-live="polite">{feedback}</p>}
    </form>
  )
}
