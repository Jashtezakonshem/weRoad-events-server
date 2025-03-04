import {
  Body,
  ConflictException,
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { EventService } from './event.service';
import { ReservationService } from './reservation.service';
import { Event as EventModel } from '@prisma/client';
import { MakeReservationDto } from './dto/makeReservation.dto';

@Controller()
export class AppController {
  constructor(
    private readonly eventService: EventService,
    private readonly reservationService: ReservationService,
  ) {}

  @Get('events')
  async getEvents(
    @Query('available') available: boolean,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ): Promise<EventModel[]> {
    return this.eventService.events({
      available,
      limit,
      page,
    });
  }

  @Get('events/:id')
  async getEventById(@Param('id') id: string): Promise<EventModel | null> {
    return this.eventService.event({ id });
  }

  @Post('reservations')
  async makeReservation(
    @Body() reservation: MakeReservationDto,
  ): Promise<EventModel | null> {
    const reservations = await this.reservationService.getReservationsByEventId(
      reservation.eventId,
    );
    // kinda weak condition, but it's just an example since the email is case-insensitive
    // and the user could have the same email with different cases
    if (
      reservations.some(
        (r) =>
          r.email === reservation.email ||
          r.telephone === reservation.telephone,
      )
    ) {
      // it's 409
      throw new ConflictException({
        message:
          "There's already a reservation with the same email or telephone number for this event",
      });
    }
    const event = await this.eventService.event({ id: reservation.eventId });
    if (!event) {
      throw new BadRequestException({
        message: 'Event not found',
      });
    }
    if (event.capacity <= reservations.length) {
      throw new BadRequestException({
        message: "There's no more capacity for this event",
      });
    }
    await this.reservationService.makeReservation(reservation);
    return event;
  }
}
