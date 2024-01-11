import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MapRecordEntity } from './entities/map_record.entity';
import {
  CreateMapRecordDto,
  UpdateMapRecordDto,
  MapRecordVO,
  MapRecordListParamsDto,
  MapRecordListVO,
} from './dto/index.dto';

@Injectable()
export class MapRecordService {
  constructor(
    @InjectRepository(MapRecordEntity)
    private readonly memorialDayRepository: Repository<MapRecordEntity>,
  ) {}

  // 创建
  async create(data: CreateMapRecordDto, followId: number) {
    const newItem = this.memorialDayRepository.create({
      ...data,
      follow: { id: followId },
    });
    return await this.memorialDayRepository.save(newItem);
  }

  // 分页列表
  async findAll(
    query: MapRecordListParamsDto,
    followId: number,
  ): Promise<MapRecordListVO> {
    const { content, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      follow: { id: followId },
    };
    if (content) {
      where.content = Like(`%${content}%`);
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
  async findOne(id: number): Promise<MapRecordVO> {
    const item = await this.memorialDayRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateMapRecordDto) {
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
