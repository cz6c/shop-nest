import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SpecificationEntity } from './entities/specification.entity';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
  SpecificationVO,
  SpecificationListParamsDto,
  SpecificationListVO,
} from './dto/index.dto';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectRepository(SpecificationEntity)
    private readonly specificationRepository: Repository<SpecificationEntity>,
  ) {}

  // 创建
  async create(data: CreateSpecificationDto) {
    const newItem = this.specificationRepository.create(data);
    return await this.specificationRepository.save(newItem);
  }

  // 分页列表
  async findAll(
    query: SpecificationListParamsDto,
  ): Promise<SpecificationListVO> {
    const { name, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
    };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.specificationRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: string): Promise<SpecificationVO> {
    const item = await this.specificationRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateSpecificationDto) {
    const { id } = data;
    const item = await this.specificationRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.specificationRepository.merge(item, data);
    return this.specificationRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.specificationRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.specificationRepository.remove(item);
    item.isDelete = true;
    return this.specificationRepository.save(item);
  }
}
