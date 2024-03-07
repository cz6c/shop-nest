import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity, OrderSkuEntity } from './entities/order.entity';
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderVO,
  OrderListParamsDto,
  OrderListVO,
  NowPreDto,
  PreOrderVO,
} from './dto/index.dto';
import { AddressService } from '../address/address.service';
import { SkuService } from '../sku/sku.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderSkuEntity)
    private readonly orderSkuRepository: Repository<OrderSkuEntity>,
    private readonly addressService: AddressService,
    private readonly skuService: SkuService,
    private readonly cartService: CartService,
  ) {}

  // 获取购物车结算订单
  async pre(memberId: string): Promise<PreOrderVO> {
    const carts = await this.cartService.findSelectedCarts(memberId);
    // 商品信息
    const skus = await Promise.all(
      carts.map(async (c) => {
        const skuVo = await this.skuService.findOne(c.sku.id);
        return {
          attrsText: skuVo.specVals.join(),
          count: c.count,
          spuId: skuVo.product.id,
          name: skuVo.product.name,
          payPrice: skuVo.price,
          picture: skuVo.picture,
          skuId: c.sku.id,
          totalPayPrice: skuVo.price * c.count,
          totalPrice: skuVo.price * c.count,
        };
      }),
    );
    const totalPrice = skus.reduce(
      (pre, cur) => (pre += cur.payPrice * cur.count),
      0,
    );
    const addressVo = await this.addressService.getDefault();
    return {
      address: addressVo,
      goods: skus,
      summary: {
        totalPrice,
        totalPayPrice: totalPrice,
        postFee: 0,
      },
    };
  }

  // 获取立即购买订单
  async nowPre(params: NowPreDto): Promise<PreOrderVO> {
    const { skuId, count } = params;
    const skuVo = await this.skuService.findOne(skuId);
    const sku = {
      attrsText: skuVo.specVals.join(),
      count: count,
      spuId: skuVo.product.id,
      name: skuVo.product.name,
      payPrice: skuVo.price,
      picture: skuVo.picture,
      skuId: skuId,
      totalPayPrice: skuVo.price * count,
      totalPrice: skuVo.price * count,
    };
    const addressVo = await this.addressService.getDefault();
    return {
      address: addressVo,
      goods: [sku],
      summary: {
        totalPrice: sku.totalPayPrice,
        totalPayPrice: sku.totalPrice,
        postFee: 0,
      },
    };
  }

  // 创建订单
  async create(data: CreateOrderDto) {
    const { addressId, goods, buyerMessage } = data;
    // 收货人信息
    const addressVo = await this.addressService.findOne(addressId);
    const { receiver, receiverMobile, address } = addressVo;
    const receiverAddress = address;
    // 商品信息
    const skus = await Promise.all(
      goods.map(async (c) => {
        const skuVo = await this.skuService.findOne(c.skuId);
        const sku = {
          spuId: skuVo.product.id,
          name: skuVo.product.name,
          quantity: c.count,
          curPrice: skuVo.price,
          picture: skuVo.picture,
        };
        const newItem = this.orderSkuRepository.create(sku);
        return await this.orderSkuRepository.save(newItem);
      }),
    );
    const totalMoney = skus.reduce(
      (pre, cur) => (pre += cur.curPrice * cur.quantity),
      0,
    );
    const payMoney = totalMoney;
    const json = {
      receiver,
      receiverMobile,
      receiverAddress,
      buyerMessage,
      skus,
      totalMoney,
      payMoney,
    };
    const newItem = this.orderRepository.create(json);
    return await this.orderRepository.save(newItem);
  }

  // 用户分页列表
  async findAllByMemberId(
    query: OrderListParamsDto,
    memberId: string,
  ): Promise<OrderListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
      member: { id: memberId },
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.orderRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 分页列表
  async findAll(query: OrderListParamsDto): Promise<OrderListVO> {
    const { page, limit } = query;
    const where: Record<string, any> = {
      isDelete: false,
    };
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.orderRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: string): Promise<OrderVO> {
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的order数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateOrderDto) {
    const { id } = data;
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.orderRepository.merge(item, data);
    return this.orderRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`order数据不存在`, 400);
    }
    // return await this.orderRepository.remove(item);
    item.isDelete = true;
    return this.orderRepository.save(item);
  }
}
