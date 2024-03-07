import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { MemberModule } from '../member/member.module';
import { SkuModule } from '../sku/sku.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), MemberModule, SkuModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
