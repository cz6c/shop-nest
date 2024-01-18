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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // 创建
  async create(data: CreateProductDto) {
    const newItem = this.productRepository.create(data);
    return await this.productRepository.save(newItem);
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
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<ProductVO> {
    const item = await this.productRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
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
