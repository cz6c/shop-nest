import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import {
  CreateCartDto,
  UpdateCartDto,
  CartVO,
  CartListParamsDto,
  CartListVO,
} from './dto/index.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  // 创建
  async create(data: CreateCartDto, memberId: number) {
    const newItem = this.cartRepository.create({
      ...data,
      member: { id: memberId },
    });
    return await this.cartRepository.save(newItem);
  }

  // 分页列表
  async findAll(
    query: CartListParamsDto,
    memberId: number,
  ): Promise<CartListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      menubar: { id: memberId },
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.cartRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<CartVO> {
    const item = await this.cartRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateCartDto) {
    const { id } = data;
    const item = await this.cartRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.cartRepository.merge(item, data);
    return this.cartRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.cartRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.cartRepository.remove(item);
    item.isDelete = true;
    return this.cartRepository.save(item);
  }
}
