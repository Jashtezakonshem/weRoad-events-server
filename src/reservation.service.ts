import { Injectable } from '@nestjs/common';
import { PrismaService } from './app.service';
import { EventService } from './event.service';
import { Reservation } from '@prisma/client';
import { MakeReservationDto } from './dto/makeReservation.dto';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async getReservationsByEventId(eventId: string): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: {
        eventId,
      },
    });
  }

  async makeReservation({
    eventId,
    email,
    telephone,
  }: MakeReservationDto): Promise<Reservation | null> {
    return this.prisma.reservation.create({
      data: {
        eventId,
        email,
        telephone,
      },
    });
  }
}
