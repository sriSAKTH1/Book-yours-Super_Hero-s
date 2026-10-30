'use client'

import { useDocumentInfo, useField } from '@payloadcms/ui'
import type { Field } from 'payload'

type Option = { label?: string; value: string | number }
type FieldWithChildren = Field & { fields?: FieldWithChildren[]; options?: Option[] }

function findStatusField(fields: FieldWithChildren[] = []): FieldWithChildren | undefined {
  for (const field of fields) {
    if ('name' in field && field.name === 'status') return field
    if ('fields' in field && field.fields) {
      const nested = findStatusField(field.fields)
      if (nested) return nested
    }
  }
  return undefined
}

export function CollectionStatusControl() {
  const { docConfig } = useDocumentInfo()
  const { value, setValue, disabled } = useField<string>({ path: 'status' })
  const statusField = findStatusField((docConfig?.fields ?? []) as FieldWithChildren[])
  const options = statusField?.options ?? []

  if (!options.length) return null

  return (
    <label className="collection-status-control">
      <span>Status <span aria-hidden="true">*</span></span>
      <select
        value={value ?? ''}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        aria-label="Status"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label ?? option.value}</option>
        ))}
      </select>
    </label>
  )
}
