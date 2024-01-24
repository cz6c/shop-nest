import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { SkuModule } from '../sku/sku.module';
import { SpecificationModule } from '../specification/specification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    SkuModule,
    SpecificationModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
