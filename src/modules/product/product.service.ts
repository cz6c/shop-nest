import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductVO,
  ProductListParamsDto,
  ProductListVO,
} from './dto/index.dto';
import { SkuService } from '../sku/sku.service';
import { SpecsService } from '../specs/specs.service';
import { CategoryService } from '../category/category.service';
import { isEqual } from 'lodash';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly skuService: SkuService,
    private readonly specsService: SpecsService,
    private readonly categoryService: CategoryService,
  ) {}

  // 创建
  async create(data: CreateProductDto) {
    const { skus, specs, categoryId } = data;
    const newItem = this.productRepository.create(data);
    newItem.category = await this.categoryService.findOne(categoryId);
    const product = await this.productRepository.save(newItem);
    // 创建sku和规格
    await this.specsService.batchCreate(
      specs.map((spec) => ({ ...spec, product })),
    );
    await this.skuService.batchCreate(skus.map((sku) => ({ ...sku, product })));
    return product;
  }

  // 分页列表
  async findAll(query: ProductListParamsDto): Promise<ProductListVO> {
    const { name, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.productRepository.findAndCount({
      where,
      relations: ['category'],
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    const arr = list.map((item) => {
      const categoryId = item.category?.id ?? null;
      const categoryName = item.category?.name ?? null;
      return { ...item, categoryId, categoryName };
    });
    return { list: arr, page, limit, total };
  }

  // 详情
  async findOne(id: string): Promise<ProductVO> {
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'skus', 'specs'],
    });
    if (!item) {
      throw new HttpException(`id为${id}的product数据不存在`, 200);
    }
    const categoryId = item.category?.id ?? null;
    const categoryName = item.category?.name ?? null;
    return {
      ...item,
      categoryId,
      categoryName,
      skus: item.skus.filter((c) => c.isDelete),
      specs: item.specs.filter((c) => c.isDelete),
    };
  }

  // 更新
  async update(data: UpdateProductDto) {
    const { id, specs, skus, categoryId } = data;
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'skus', 'specs'],
    });
    const mergeData = {};
    for (const key in data) {
      if (
        Object.prototype.hasOwnProperty.call(data, key) &&
        !['specs', 'skus'].includes(key)
      ) {
        mergeData[key] = data[key];
      }
    }
    const updateItem = this.productRepository.merge(item, mergeData);
    // 同步更新sku和规格/分类
    if (!isEqual(specs, item.specs)) {
      updateItem.specs = await this.specsService.batchUpdate(specs, item);
    }
    if (!isEqual(skus, item.skus)) {
      updateItem.skus = await this.skuService.batchUpdate(skus, item);
    }
    // 分类改变时更新分类
    if (item.category.id !== categoryId) {
      updateItem.category = await this.categoryService.findOne(categoryId);
    }
    return this.productRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的product数据不存在`, 400);
    }
    // return await this.productRepository.remove(item);
    item.isDelete = true;
    return this.productRepository.save(item);
  }
}
