'use client'

import { useState, type FormEvent } from 'react'

export default function ConsultationForm() {
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
    const data = {
      name: String(values.get('name') ?? ''),
      email: String(values.get('email') ?? ''),
      phone: String(values.get('phone') ?? ''),
      consultationType: String(values.get('consultationType') ?? ''),
      preferredDate: String(values.get('preferredDate') ?? '') || undefined,
      preferredTime: String(values.get('preferredTime') ?? '') || undefined,
      message: String(values.get('message') ?? ''),
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
      const response = await fetch(`${apiUrl}/consultation-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Submission failed.')
      setSuccess(true)
      setFeedback(result.message)
      form.reset()
    } catch {
      setFeedback('Unable to send your request right now. Please try again shortly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <label htmlFor="consultation-name">Full name<input className="form-control" id="consultation-name" name="name" autoComplete="name" maxLength={120} required /></label>
      <label htmlFor="consultation-email">Email address<input className="form-control" id="consultation-email" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label htmlFor="consultation-phone">Phone number<input className="form-control" id="consultation-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} required /></label>
      <label htmlFor="consultation-type">How can we help?<select className="form-control" id="consultation-type" name="consultationType" required defaultValue="general"><option value="general">Community response request</option><option value="feedback">Share feedback</option><option value="service-inquiry">Hero service or partnership</option></select></label>
      <div className="form-row"><label htmlFor="preferred-date">Preferred date <span>(optional)</span><input className="form-control" id="preferred-date" name="preferredDate" type="date" /></label><label htmlFor="preferred-time">Preferred time <span>(optional)</span><select className="form-control" id="preferred-time" name="preferredTime" defaultValue=""><option value="">Any time</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></label></div>
      <label htmlFor="consultation-message">Tell us what support is needed<textarea className="form-control" id="consultation-message" name="message" rows={4} maxLength={5000} required /></label>
      {feedback && <p className={success ? 'form-notice' : 'form-error'} role="status" aria-live="polite">{feedback}</p>}
      <button className="button button-dark" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Contact us'} <span aria-hidden="true">↗</span></button>
    </form>
  )
}
