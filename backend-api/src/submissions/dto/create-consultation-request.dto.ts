import {
  IsDateString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateConsultationRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string

  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  phone!: string

  @IsIn(['general', 'feedback', 'service-inquiry'])
  consultationType!: 'general' | 'feedback' | 'service-inquiry'

  @IsOptional()
  @IsDateString()
  preferredDate?: string

  @IsOptional()
  @IsIn(['morning', 'afternoon', 'evening'])
  preferredTime?: 'morning' | 'afternoon' | 'evening'

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string
}
