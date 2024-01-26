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
import { SpecificationService } from '../specification/specification.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly skuService: SkuService,
    private readonly specificationService: SpecificationService,
    private readonly categoryService: CategoryService,
  ) {}

  // 创建
  async create(data: CreateProductDto) {
    const { skus, specs, categoryId } = data;
    const newItem = this.productRepository.create(data);
    newItem.category = await this.categoryService.findOne(categoryId);
    const product = await this.productRepository.save(newItem);
    // 创建sku和规格
    await Promise.all(
      specs.map((spec) =>
        this.specificationService.create({ ...spec, products: [product] }),
      ),
    );
    await Promise.all(
      skus.map((sku) => this.skuService.create({ ...sku, product })),
    );
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
  async findOne(id: number): Promise<ProductVO> {
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'skus', 'specs'],
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    const categoryId = item.category?.id ?? null;
    const categoryName = item.category?.name ?? null;
    return { ...item, categoryId, categoryName };
  }

  // 更新
  async update(data: UpdateProductDto) {
    const { id } = data;
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.productRepository.merge(item, data);
    return this.productRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.productRepository.remove(item);
    item.isDelete = true;
    return this.productRepository.save(item);
  }
}
