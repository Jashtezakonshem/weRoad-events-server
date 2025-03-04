import { IsEmail, IsNotEmpty } from 'class-validator';

export class MakeReservationDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  telephone: string;

  @IsNotEmpty()
  eventId: string;
}
