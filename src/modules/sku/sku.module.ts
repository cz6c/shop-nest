import { Module } from '@nestjs/common';
import { SkuService } from './sku.service';
import { SkuController } from './sku.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkuEntity } from './entities/sku.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SkuEntity])],
  controllers: [SkuController],
  providers: [SkuService],
})
export class SkuModule {}
