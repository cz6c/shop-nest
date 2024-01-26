import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { MemberService } from '../member/member.service';
import { SkuService } from '../sku/sku.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity]), MemberService, SkuService],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
