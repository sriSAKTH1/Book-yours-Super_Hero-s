import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto.js'
import { CreateConsultationRequestDto } from './dto/create-consultation-request.dto.js'
import { CreateNewsletterSubscriptionDto } from './dto/create-newsletter-subscription.dto.js'
import { SubmissionsService } from './submissions.service.js'

@Controller()
export class SubmissionsController {
  constructor(private readonly submissions: SubmissionsService) {}

  @Post('contact-inquiries')
  @HttpCode(HttpStatus.CREATED)
  createContact(@Body() dto: CreateContactInquiryDto) {
    return this.submissions.createContact(dto)
  }

  @Post('consultation-requests')
  @HttpCode(HttpStatus.CREATED)
  createConsultation(@Body() dto: CreateConsultationRequestDto) {
    return this.submissions.createConsultation(dto)
  }

  @Post('newsletter-subscriptions')
  @HttpCode(HttpStatus.CREATED)
  createNewsletter(@Body() dto: CreateNewsletterSubscriptionDto) {
    return this.submissions.createNewsletter(dto)
  }
}
