
'use client'

import { useState, type FormEvent } from 'react'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback('')
    setSuccess(false)

    const form = event.currentTarget
    const formData = new FormData(form)

    const data = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
      const response = await fetch(`${apiUrl}/contact-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed.')
      }

      setSuccess(true)
      setFeedback(result.message)
      form.reset()
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? 'Unable to send your inquiry right now. Please try again shortly.'
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="submission-form">
      <div>
        <label htmlFor="contact-name">
          Full name *
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          className="form-control"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="contact-email">
          Email address *
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          className="form-control"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="contact-phone">
          Phone number
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          className="form-control"
          placeholder="Your contact number"
        />
      </div>

      <div>
        <label htmlFor="contact-subject">
          Subject *
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={200}
          required
          className="form-control"
          placeholder="How can we help?"
        />
      </div>

      <div>
        <label htmlFor="contact-message">
          Your message *
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={5000}
          required
          className="form-control"
          placeholder="Tell us about your inquiry..."
        />
      </div>

      {feedback && (
        <p
          role="status"
          aria-live="polite"
          className={success ? 'form-notice' : 'form-error'}
        >
          {feedback}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="button button-dark"
      >
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>

      <p className="form-help">
        Fields marked * are required. Please do not include passwords or other
        sensitive information in your message.
      </p>
    </form>
  )
}
