import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto.js'
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto.js'
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto.js'

@Injectable()
export class SubmissionsService {
  constructor(private readonly config: ConfigService) {}

  private async forward(type: string, data: object) {
    const baseUrl = this.config.get<string>('PAYLOAD_INTERNAL_BASE_URL')
    const secret = this.config.get<string>('INTERNAL_API_SECRET')

    if (!baseUrl || !secret) {
      throw new ServiceUnavailableException('Submission service is not configured.')
    }

    let response: Response
    try {
      response = await fetch(`${baseUrl.replace(/\/$/, '')}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-api-secret': secret,
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(10_000),
      })
    } catch {
      throw new ServiceUnavailableException('Unable to reach the content service.')
    }

    if (!response.ok) {
      throw new BadGatewayException('The submission could not be saved.')
    }

    return { message: 'Your submission has been received successfully.' }
  }

  createContact(dto: CreateContactInquiryDto) {
    return this.forward('contact-inquiries', {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone?.trim() ?? '',
      subject: dto.subject.trim(),
      message: dto.message.trim(),
    })
  }

  createConsultation(dto: CreateConsultationRequestDto) {
    return this.forward('consultation-requests', {
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      consultationType: dto.consultationType,
      preferredDate: dto.preferredDate,
      preferredTime: dto.preferredTime,
      message: dto.message.trim(),
    })
  }

  createNewsletter(dto: CreateNewsletterSubscriptionDto) {
    return this.forward('newsletter-subscriptions', {
      email: dto.email.trim().toLowerCase(),
      consent: dto.consent,
    })
  }
}
