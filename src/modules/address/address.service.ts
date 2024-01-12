import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressVO,
  AddressListParamsDto,
  AddressListVO,
} from './dto/index.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly memorialDayRepository: Repository<AddressEntity>,
  ) {}

  // 创建
  async create(data: CreateAddressDto, userId: number) {
    const newItem = this.memorialDayRepository.create({
      ...data,
      user: { id: userId },
    });
    return await this.memorialDayRepository.save(newItem);
  }

  // 分页列表
  async findAll(
    query: AddressListParamsDto,
    userId: number,
  ): Promise<AddressListVO> {
    const { receiver, page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      user: { id: userId },
    };
    if (receiver) {
      where.receiver = Like(`%${receiver}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.memorialDayRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<AddressVO> {
    const item = await this.memorialDayRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateAddressDto) {
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
