import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController, ProductControllerApp } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity, SpecsEntity } from './entities/product.entity';
import { SkuModule } from '../sku/sku.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, SpecsEntity]),
    SkuModule,
    CategoryModule,
  ],
  controllers: [ProductController, ProductControllerApp],
  providers: [ProductService],
})
export class ProductModule {}
