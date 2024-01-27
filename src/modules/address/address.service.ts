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
import { MemberService } from '../member/member.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly memberService: MemberService,
  ) {}

  // 添加收货地址
  async create(data: CreateAddressDto, memberId: number) {
    // 新增地址为默认时
    if (data.isDefault) {
      const list = await this.addressRepository.find({
        where: {
          isDelete: false,
          isDefault: true,
          member: { id: memberId },
        },
      });
      if (list[0]) {
        await this.addressRepository.update(list[0].id, { isDefault: false });
      }
    }
    const newItem = this.addressRepository.create(data);
    newItem.member = await this.memberService.findOne(memberId);
    return await this.addressRepository.save(newItem);
  }

  // 收货地址列表
  async findAll(
    query: AddressListParamsDto,
    memberId: number,
  ): Promise<AddressListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      member: { id: memberId },
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.addressRepository.findAndCount({
      where,
      order: { updateTime: 'DESC', isDefault: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 收货地址详情
  async findOne(id: number): Promise<AddressVO> {
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的address数据不存在`, 200);
    }
    return item;
  }

  // 更新收货地址
  async update(data: UpdateAddressDto, memberId: number) {
    const { id } = data;
    // 更新地址为默认时
    if (data.isDefault) {
      const list = await this.addressRepository.find({
        where: {
          isDelete: false,
          isDefault: true,
          member: { id: memberId },
        },
      });
      if (list[0]) {
        await this.addressRepository.update(list[0].id, { isDefault: false });
      }
    }
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.addressRepository.merge(item, data);
    return await this.addressRepository.save(updateItem);
  }

  // 刪除收货地址
  async remove(id: number) {
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的address数据不存在`, 400);
    }
    item.isDelete = true;
    return this.addressRepository.save(item);
  }

  // 设置默认收货地址
  async setDefault(id: number, memberId: number) {
    const list = await this.addressRepository.find({
      where: {
        isDelete: false,
        isDefault: true,
        member: { id: memberId },
      },
    });
    if (list[0]) {
      await this.addressRepository.update(list[0].id, { isDefault: false });
    }
    this.addressRepository.update(id, { isDefault: true });
  }
}
