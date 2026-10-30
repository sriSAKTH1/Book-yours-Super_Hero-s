import type { Field, RowField } from 'payload'

/** Places compact CMS fields beside one another in a responsive Payload row. */
export function twoColumnRow(...fields: Field[]): RowField {
  return {
    type: 'row',
    fields: fields.map((field) => ({
      ...field,
      admin: { ...field.admin, width: field.admin?.width ?? '50%' },
    })) as RowField['fields'],
  }
}
