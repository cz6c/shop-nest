import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { AddressModule } from '../address/address.module';
import { SkuModule } from '../sku/sku.module';
import { OrderSkuEntity } from './entities/orderSku.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderSkuEntity]),
    AddressModule,
    SkuModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
