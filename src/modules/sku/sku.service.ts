import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SkuEntity } from './entities/sku.entity';
import {
  CreateSkuDto,
  UpdateSkuDto,
  SkuListParamsDto,
  SkuListVO,
} from './dto/index.dto';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(SkuEntity)
    private readonly skuRepository: Repository<SkuEntity>,
  ) {}

  // 创建
  async create(data: CreateSkuDto) {
    const newItem = this.skuRepository.create(data);
    return await this.skuRepository.save(newItem);
  }

  async batchCreate(data: CreateSkuDto[]) {
    const newItem = this.skuRepository.create(data);
    return await this.skuRepository.save(newItem);
  }

  // 分页列表
  async findAll(query: SkuListParamsDto): Promise<SkuListVO> {
    const { skuName, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
    };
    if (skuName) {
      where.skuName = Like(`%${skuName}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.skuRepository.findAndCount({
      where,
      relations: ['product'],
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number) {
    const item = await this.skuRepository.findOne({
      where: { id, isDelete: false },
      relations: ['product'],
    });
    if (!item) {
      throw new HttpException(`id为${id}的sku数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateSkuDto) {
    const { id } = data;
    const item = await this.skuRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.skuRepository.merge(item, data);
    return this.skuRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.skuRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的sku数据不存在`, 400);
    }
    // return await this.skuRepository.remove(item);
    item.isDelete = true;
    return this.skuRepository.save(item);
  }
}
