import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { SkuEntity } from './entities/sku.entity';
import {
  CreateSkuDto,
  UpdateSkuDto,
  SkuListParamsDto,
  SkuListVO,
} from './dto/index.dto';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(SkuEntity)
    private readonly skuRepository: Repository<SkuEntity>,
  ) {}

  // 创建
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
  async findOne(id: string) {
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
    // const item = await this.skuRepository.findOne({
    //   where: { id, isDelete: false },
    // });
    // const updateItem = this.skuRepository.merge(item, data);
    // return this.skuRepository.save(updateItem);
    return await this.skuRepository.update(id, data);
  }

  async batchUpdate(data: UpdateSkuDto[], product: ProductEntity) {
    // 有新增则新增
    const newdata = data.filter((c) => !c.id).map((x) => ({ ...x, product }));
    const newItems = newdata.length ? await this.batchCreate(newdata) : [];
    // 其他的更新
    const updateData = data.filter((c) => c.id);
    const updateItems = await Promise.all(
      updateData.map(async (c) => {
        const { id } = c;
        const item = await this.skuRepository.findOne({
          where: { id },
        });
        const updateItem = this.skuRepository.merge(item, c);
        return await this.skuRepository.save(updateItem);
      }),
    );
    return [...newItems, ...updateItems];
  }

  // 刪除
  async removes(ids: string[]) {
    const items = await this.skuRepository.findBy({
      id: In(ids),
    });
    items.forEach((c) => (c.isDelete = true));
    return await this.skuRepository.save(items);
  }
}
