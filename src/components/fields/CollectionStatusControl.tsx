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
    <div className="collection-status-control">
      <span className="collection-status-label">Status</span>
      <div className="collection-status-options" role="group" aria-label="Status">
        {options.map((option) => {
          const optionValue = String(option.value)
          const selected = String(value ?? '') === optionValue

          return (
            <button
              className={`collection-status-option${selected ? ' is-selected' : ''}`}
              key={optionValue}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => setValue(optionValue)}
            >
              {option.label ?? optionValue}
            </button>
          )
        })}
      </div>
    </div>
  )
}
