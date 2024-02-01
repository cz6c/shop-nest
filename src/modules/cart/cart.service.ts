import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from './entities/cart.entity';
import {
  CreateCartDto,
  UpdateCartDto,
  CartListParamsDto,
  CartListVO,
} from './dto/index.dto';
import { MemberService } from '../member/member.service';
import { SkuService } from '../sku/sku.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly memberService: MemberService,
    private readonly skuService: SkuService,
  ) {}

  // 加入购物车
  async create(data: CreateCartDto, memberId: string) {
    const newItem = this.cartRepository.create(data);
    newItem.member = await this.memberService.findOne(memberId);
    newItem.sku = await this.skuService.findOne(data.skuId);
    newItem.price = newItem.sku.price;
    return await this.cartRepository.save(newItem);
  }

  // 购物车列表
  async findAll(
    query: CartListParamsDto,
    memberId: string,
  ): Promise<CartListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      menubar: { id: memberId },
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.cartRepository.findAndCount({
      where,
      relations: ['sku'],
      order: { createTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 更新购物车单品
  async update(data: UpdateCartDto) {
    const { id } = data;
    const item = await this.cartRepository.findOne({
      where: { id },
      relations: ['sku'],
    });
    const updateItem = this.cartRepository.merge(item, data);
    // 更新sku信息
    if (item.sku.id !== data.skuId) {
      updateItem.sku = await this.skuService.findOne(data.skuId);
      updateItem.price = updateItem.sku.price;
    }
    return this.cartRepository.save(updateItem);
  }

  // 删除/清空购物车单品
  async delete(ids: string[]) {
    // const list = await this.cartRepository.findBy({
    //   id: In(ids),
    // });
    // return await this.cartRepository.remove(list);
    return await this.cartRepository.delete(ids);
  }
}
