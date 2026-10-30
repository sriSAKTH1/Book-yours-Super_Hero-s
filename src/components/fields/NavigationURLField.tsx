'use client'

import { useField, useFieldPath } from '@payloadcms/ui'
import { useEffect, useMemo, useState } from 'react'

type NavigationLink = { label?: string | null; url?: string | null }

export function NavigationURLField() {
  const path = useFieldPath()
  const { value, setValue } = useField<string>({ path })
  const [links, setLinks] = useState<NavigationLink[]>([])
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let active = true

    fetch('/api/globals/header?depth=0')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load header navigation')
        return response.json()
      })
      .then((header: { navigation?: NavigationLink[] }) => {
        if (active) setLinks(header.navigation ?? [])
      })
      .catch(() => {
        if (active) setLoadFailed(true)
      })

    return () => {
      active = false
    }
  }, [])

  const options = useMemo(() => {
    const byURL = new Map<string, string>()
    for (const link of links) {
      const url = link.url?.trim()
      if (url && !byURL.has(url)) byURL.set(url, `${link.label?.trim() || url} (${url})`)
    }
    return [...byURL.entries()]
  }, [links])

  const isKnownURL = options.some(([url]) => url === value)
  const selectedURL = isKnownURL ? value : 'custom'

  return (
    <div className="navigation-url-field field-type">
      <label className="field-label" htmlFor={`${path}-mode`}>Button destination</label>
      <span className="navigation-url-caption">Choose a saved link or enter a custom address.</span>
      <select
        className="navigation-url-select"
        id={`${path}-mode`}
        value={selectedURL || ''}
        onChange={(event) => {
          if (event.target.value === 'custom') {
            if (isKnownURL) setValue('')
          } else {
            setValue(event.target.value)
          }
        }}
      >
        <option value="" disabled>Choose a Navigation Link URL</option>
        {options.map(([url, label]) => <option key={url} value={url}>{label}</option>)}
        <option value="custom">Enter a new URL</option>
      </select>
      {!isKnownURL && (
        <div className="navigation-url-input-wrap">
          <span aria-hidden="true" className="navigation-url-icon">↗</span>
          <input
            className="navigation-url-input"
            type="text"
            value={value ?? ''}
            onChange={(event) => setValue(event.target.value)}
            placeholder="/contact or https://example.com"
            aria-label="Custom button URL"
          />
        </div>
      )}
      <div className="navigation-url-help">
        {loadFailed
          ? 'Could not load Navigation Links. You can still enter a URL manually.'
          : 'Choose a URL from Website Header → Navigation Links, or enter a new URL.'}
      </div>
    </div>
  )
}
