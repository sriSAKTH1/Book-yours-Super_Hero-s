import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator'

export class CreateContactInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string

  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string
}
