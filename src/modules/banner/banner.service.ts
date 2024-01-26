import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerVO,
  BannerListParamsDto,
  BannerListVO,
} from './dto/index.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {}

  // 创建
  async create(data: CreateBannerDto) {
    const newItem = this.bannerRepository.create(data);
    return await this.bannerRepository.save(newItem);
  }

  // 分页列表
  async findAll(query: BannerListParamsDto): Promise<BannerListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.bannerRepository.findAndCount({
      where,
      order: { updateTime: 'DESC', },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<BannerVO> {
    const item = await this.bannerRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateBannerDto) {
    const { id } = data;
    const item = await this.bannerRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.bannerRepository.merge(item, data);
    return this.bannerRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.bannerRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.bannerRepository.remove(item);
    item.isDelete = true;
    return this.bannerRepository.save(item);
  }
}
