import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TagEntity } from './entities/tag.entity';
import {
  CreateTagDto,
  UpdateTagDto,
  TagVO,
  TagListVO,
  TagListParamsDto,
} from './dto/index.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  // 创建
  async create(data: CreateTagDto) {
    const { name } = data;
    const item = await this.tagRepository.findOne({
      where: { name, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${name}已存在`, 200);
    }
    const newItem = this.tagRepository.create(data);
    return await this.tagRepository.save(newItem);
  }

  // 列表
  async findAll(query: TagListParamsDto): Promise<TagListVO> {
    const { name, page, limit } = query;
    const where: Record<string, any> = { isDelete: false };
    if (name) {
      where.name = Like(`%${name}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.tagRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<TagVO> {
    const item = await this.tagRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateTagDto) {
    const { id } = data;
    const item = await this.tagRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    const updateItem = this.tagRepository.merge(item, data);
    return this.tagRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.tagRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    // return await this.tagRepository.remove(item);
    item.isDelete = true;
    return this.tagRepository.save(item);
  }
}
