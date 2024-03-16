import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController, BannerControllerApp } from './banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerEntity } from './entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity])],
  controllers: [BannerController, BannerControllerApp],
  providers: [BannerService],
})
export class BannerModule {}
