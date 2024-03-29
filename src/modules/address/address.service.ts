import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressVO,
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
  async create(data: CreateAddressDto, memberId: string) {
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
  async findAll(memberId: string): Promise<AddressListVO> {
    const where: Record<string, any> = {
      isDelete: false,
      member: { id: memberId },
    };
    const list = await this.addressRepository.find({
      where,
      order: { updateTime: 'DESC', isDefault: 'DESC' },
    });
    return { list };
  }

  // 收货地址详情
  async findOne(id: string): Promise<AddressVO> {
    const item = await this.addressRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的address数据不存在`, 200);
    }
    return item;
  }

  // 更新收货地址
  async update(data: UpdateAddressDto, memberId: string) {
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
  async remove(id: string) {
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
  async setDefault(id: string, memberId: string) {
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

  // 获取默认地址
  async getDefault(): Promise<AddressVO> {
    const item = await this.addressRepository.findOne({
      where: { isDefault: true },
    });
    return item;
  }
}
