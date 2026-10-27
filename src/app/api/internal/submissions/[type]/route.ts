import { timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

const submissionTypes = [
  'contact-inquiries',
  'consultation-requests',
  'newsletter-subscriptions',
] as const

type SubmissionType = (typeof submissionTypes)[number]
type Body = Record<string, unknown>
type ConsultationType = 'general' | 'feedback' | 'service-inquiry'
type PreferredTime = 'morning' | 'afternoon' | 'evening'

const consultationTypes: readonly ConsultationType[] = ['general', 'feedback', 'service-inquiry']
const preferredTimes: readonly PreferredTime[] = ['morning', 'afternoon', 'evening']

function isObject(value: unknown): value is Body {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sameSecret(expected: string | undefined, supplied: string | null) {
  if (!expected || !supplied) return false
  const expectedBytes = Buffer.from(expected)
  const suppliedBytes = Buffer.from(supplied)
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes)
}

function validEmail(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validText(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength
}

function validConsultationType(value: unknown): value is ConsultationType {
  return typeof value === 'string' && consultationTypes.includes(value as ConsultationType)
}

function validPreferredTime(value: unknown): value is PreferredTime {
  return typeof value === 'string' && preferredTimes.includes(value as PreferredTime)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  if (!sameSecret(process.env.INTERNAL_API_SECRET, request.headers.get('x-internal-api-secret'))) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { type } = await params
  if (!submissionTypes.includes(type as SubmissionType)) {
    return NextResponse.json({ message: 'Unknown submission type' }, { status: 404 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > 16_384) {
    return NextResponse.json({ message: 'Request is too large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }
  if (!isObject(body)) {
    return NextResponse.json({ message: 'Invalid submission' }, { status: 400 })
  }

  const normalizedType = type as SubmissionType
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  try {
    const payload = await getPayloadClient()
    if (normalizedType === 'contact-inquiries') {
      if (
        !validText(body.name, 120) ||
        !validEmail(email) ||
        (body.phone !== undefined && (typeof body.phone !== 'string' || body.phone.length > 40)) ||
        !validText(body.subject, 200) ||
        !validText(body.message, 5000)
      ) {
        return NextResponse.json({ message: 'Invalid contact inquiry' }, { status: 400 })
      }

      await payload.create({
        collection: 'contact-inquiries',
        overrideAccess: true,
        draft: false,
        data: {
          name: body.name.trim(),
          email,
          phone: typeof body.phone === 'string' ? body.phone.trim() : '',
          subject: body.subject.trim(),
          message: body.message.trim(),
          status: 'new',
        },
      })
    } else if (normalizedType === 'consultation-requests') {
      const preferredDate = body.preferredDate
      const validDate =
        preferredDate === undefined ||
        (typeof preferredDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) &&
          !Number.isNaN(Date.parse(`${preferredDate}T00:00:00.000Z`)) &&
          new Date(`${preferredDate}T00:00:00.000Z`).toISOString().startsWith(preferredDate))

      if (
        !validText(body.name, 120) ||
        !validEmail(email) ||
        !validText(body.phone, 40) ||
        !validConsultationType(body.consultationType) ||
        !validDate ||
        (body.preferredTime !== undefined && !validPreferredTime(body.preferredTime)) ||
        !validText(body.message, 5000)
      ) {
        return NextResponse.json({ message: 'Invalid consultation request' }, { status: 400 })
      }

      await payload.create({
        collection: 'consultation-requests',
        overrideAccess: true,
        draft: false,
        data: {
          name: body.name.trim(),
          email,
          phone: body.phone.trim(),
          consultationType: body.consultationType,
          ...(typeof preferredDate === 'string' ? { preferredDate } : {}),
          ...(body.preferredTime ? { preferredTime: body.preferredTime } : {}),
          message: body.message.trim(),
          status: 'new',
        },
      })
    } else {
      if (!validEmail(email) || body.consent !== true) {
        return NextResponse.json({ message: 'Valid email and explicit consent are required' }, { status: 400 })
      }

      const existing = await payload.find({
        collection: 'newsletter-subscribers',
        where: { email: { equals: email } },
        limit: 1,
        overrideAccess: true,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'newsletter-subscribers',
          overrideAccess: true,
          draft: false,
          data: { email, consent: true, status: 'pending' },
        })
      }
    }

    return NextResponse.json({ message: 'Submission saved successfully' }, { status: 201 })
  } catch (error) {
    console.error('Internal submission failed:', error)
    return NextResponse.json({ message: 'Could not save the submission' }, { status: 500 })
  }
}
