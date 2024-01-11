import { Module } from '@nestjs/common';
import { MemorialDayService } from './memorial_day.service';
import { MemorialDayController } from './memorial_day.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemorialDayEntity } from './entities/memorial_day.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemorialDayEntity])],
  controllers: [MemorialDayController],
  providers: [MemorialDayService],
})
export class MemorialDayModule {}
