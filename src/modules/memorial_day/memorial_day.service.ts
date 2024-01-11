import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MemorialDayEntity } from './entities/memorial_day.entity';
import {
  CreateMemorialDayDto,
  UpdateMemorialDayDto,
  MemorialDayVO,
  MemorialDayListVO,
  MemorialDayListParamsDto,
} from './dto/index.dto';

@Injectable()
export class MemorialDayService {
  constructor(
    @InjectRepository(MemorialDayEntity)
    private readonly memorialDayRepository: Repository<MemorialDayEntity>,
  ) {}

  // 创建
  async create(data: CreateMemorialDayDto, followId: number) {
    const { title } = data;
    const item = await this.memorialDayRepository.findOne({
      where: { title, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${title}已存在`, 200);
    }
    const newItem = this.memorialDayRepository.create({
      ...data,
      follow: { id: followId },
    });
    return await this.memorialDayRepository.save(newItem);
  }

  // 列表
  async findAll(
    query: MemorialDayListParamsDto,
    followId: number,
  ): Promise<MemorialDayListVO> {
    const { title, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      follow: { id: followId },
    };
    if (title) {
      where.title = Like(`%${title}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.memorialDayRepository.findAndCount({
      where,
      order: { eventDate: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<MemorialDayVO> {
    const item = await this.memorialDayRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateMemorialDayDto) {
    const { id } = data;
    const item = await this.memorialDayRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.memorialDayRepository.merge(item, data);
    return this.memorialDayRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.memorialDayRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.memorialDayRepository.remove(item);
    item.isDelete = true;
    return this.memorialDayRepository.save(item);
  }
}
