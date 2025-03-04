import { Injectable } from '@nestjs/common';
import { PrismaService } from './app.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async event(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
  ): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: eventWhereUniqueInput,
      include: {
        reservations: true,
      },
    });
  }

  async events({
    available,
    limit,
    page,
  }: {
    available: boolean;
    limit: number;
    page: number;
  }): Promise<Event[]> {
    const skip = page ? (page - 1) * limit : 0;
    const events = await this.prisma.event.findMany({
      skip,
      take: limit,
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });
    return events
      .filter((event) =>
        available === undefined
          ? true
          : available
            ? event.capacity > event._count.reservations
            : event.capacity === event._count.reservations,
      )
      .map((event) => ({
        ...event,
        reservationsCount: event._count.reservations,
      }));
  }
}
