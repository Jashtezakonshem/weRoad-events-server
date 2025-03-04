import { Injectable } from '@nestjs/common';
import { PrismaService } from './app.service';
import { Event, Prisma } from '@prisma/client';
import { Availability } from './types';

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
    available: Availability;
    limit: number;
    page: number;
  }): Promise<Event[]> {
    //TODO
    // in order to use available I need use groupBy
    // and having, considering reservations.length and capacity
    console.log({ available });
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
    // I didn't find a smart way to change _count into a more talking name
    return events.map((event) => ({
      ...event,
      reservationsCount: event._count.reservations,
    }));
  }
}
