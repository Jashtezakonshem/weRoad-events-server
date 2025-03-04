import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './app.service';
import { EventService } from './event.service';
import { ReservationService } from './reservation.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [PrismaService, EventService, ReservationService],
})
export class AppModule {}
