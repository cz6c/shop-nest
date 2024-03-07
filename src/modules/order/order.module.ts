import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController, OrderControllerApp } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, OrderSkuEntity } from './entities/order.entity';
import { AddressModule } from '../address/address.module';
import { SkuModule } from '../sku/sku.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderSkuEntity]),
    AddressModule,
    SkuModule,
    CartModule,
  ],
  controllers: [OrderController, OrderControllerApp],
  providers: [OrderService],
})
export class OrderModule {}
