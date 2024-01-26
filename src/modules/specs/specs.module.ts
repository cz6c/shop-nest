import { Module } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { SpecsController } from './specs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecsEntity } from './entities/specs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecsEntity])],
  controllers: [SpecsController],
  providers: [SpecsService],
  exports: [SpecsService],
})
export class SpecsModule {}
