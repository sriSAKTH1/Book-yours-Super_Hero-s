'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [retryState, setRetryState] = useState({ error, loading: false })

  if (retryState.error !== error) {
    setRetryState({ error, loading: false })
  }

  const { loading } = retryState

  const handleRetry = () => {
    setRetryState({ error, loading: true })
    reset()
  }

  return (
    <main className="error-page">
      <div className="error-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37 + 5) % 100}%`,
              top: `${(i * 53 + 9) % 100}%`,
              animationDuration: `${4 + i * 0.25}s`,
              animationDelay: `${i * -0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="error-content">
        <div className="error-emblem" aria-hidden="true">
          <div className="emblem-ring" />
          <div className="emblem-icon">⚡</div>
        </div>

        <p className="error-eyebrow">
          <span className="status-dot" />
          SUPERHERO HQ · SYSTEM ALERT
        </p>

        <h1>
          Even heroes
          <br />
          need a <span>moment.</span>
        </h1>

        <p className="error-description">
          Something unexpected interrupted this mission. Don&apos;t worry — our heroes are working to
          get everything back on track.
        </p>

        <div className="error-code">
          <span>ERROR</span>
          <strong>MISSION INTERRUPTED</strong>
        </div>

        <div className="error-actions">
          <button className="retry-button" onClick={handleRetry} disabled={loading}>
            <span className={loading ? 'retry-spinner' : ''} aria-hidden="true">
              ↻
            </span>
            {loading ? 'Retrying...' : 'Try Again'}
          </button>

          <Link href="/" className="home-button">
            Return Home <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className="error-footer">
          <span aria-hidden="true">✦</span> Every mission deserves another attempt.
        </p>
      </div>
    </main>
  )
}
