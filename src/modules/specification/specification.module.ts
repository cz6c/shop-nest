import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecificationEntity } from './entities/specification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecificationEntity])],
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
