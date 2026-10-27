import { Equals, IsBoolean, IsEmail, MaxLength } from 'class-validator'

export class CreateNewsletterSubscriptionDto {
  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsBoolean()
  @Equals(true)
  consent!: true
}
