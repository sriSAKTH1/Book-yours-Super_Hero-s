import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config.ts'

const title = 'Website Contact Form'
const confirmationMessage = {
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr',
    format: '',
    indent: 0,
    children: [{
      type: 'paragraph',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      textFormat: 0,
      textStyle: '',
      children: [{ type: 'text', version: 1, text: 'Thanks for reaching out. Your message has been received by our team.' }],
    }],
  },
}

const payload = await getPayload({ config })

try {
  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: title } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })

  if (existing.docs.length) {
    console.log(`Kept existing CMS form: ${title}`)
  } else {
    await payload.create({
      collection: 'forms',
      data: {
        title,
        fields: [
          { blockType: 'text', name: 'name', label: 'Full name', required: true },
          { blockType: 'email', name: 'email', label: 'Email address', required: true },
          { blockType: 'text', name: 'phone', label: 'Phone number' },
          { blockType: 'text', name: 'subject', label: 'Subject', required: true },
          { blockType: 'textarea', name: 'message', label: 'Your message', required: true },
        ],
        submitButtonLabel: 'Send Message',
        confirmationType: 'message',
        confirmationMessage,
      } as never,
      overrideAccess: true,
    })
    console.log(`Created CMS form: ${title}`)
  }
} finally {
  await payload.destroy()
}
