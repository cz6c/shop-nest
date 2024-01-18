import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    private readonly addressRepository: Repository<AddressEntity>,
  ) {}

  // 创建
  async create(data: CreateAddressDto, userId: number) {
    const newItem = this.addressRepository.create({
      ...data,
      user: { id: userId },
    });
    return await this.addressRepository.save(newItem);
  }

  // 分页列表
  async findAll(
    query: AddressListParamsDto,
    userId: number,
  ): Promise<AddressListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      user: { id: userId },
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.addressRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<AddressVO> {
    const item = await this.addressRepository.findOne({
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
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.addressRepository.merge(item, data);
    return this.addressRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.addressRepository.remove(item);
    item.isDelete = true;
    return this.addressRepository.save(item);
  }
}
