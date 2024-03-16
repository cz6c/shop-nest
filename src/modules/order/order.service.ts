import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { OrderEntity, OrderSkuEntity } from './entities/order.entity';
import {
  CreateOrderDto,
  OrderVO,
  OrderListParamsDto,
  OrderListVO,
  NowPreDto,
  PreOrderVO,
  CancelOrderDto,
  PreOrderGoodsItem,
} from './dto/index.dto';
import { AddressService } from '../address/address.service';
import { SkuService } from '../sku/sku.service';
import { CartService } from '../cart/cart.service';
import { OrderState } from '@/common/common.enum';

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

  /**
   * @description: 组装sku数据
   * @param {string} skuId
   * @param {number} count
   * @return {*}
   */
  async assembleSkuData(
    skuId: string,
    count: number,
  ): Promise<PreOrderGoodsItem> {
    const skuVo = await this.skuService.findOne(skuId);
    return {
      attrsText: skuVo.specVals.join(),
      count: count,
      spuId: skuVo.product.id,
      name: skuVo.product.name,
      payPrice: skuVo.price,
      picture: skuVo.picture,
      skuId,
      totalPayPrice: skuVo.price * count,
    };
  }

  /**
   * @description: 获取购物车结算订单
   * @param {string} memberId
   * @return {*}
   */
  async pre(memberId: string): Promise<PreOrderVO> {
    const carts = await this.cartService.findSelectedCarts(memberId);
    // 商品信息
    const skus = await Promise.all(
      carts.map(async (c) => {
        return await this.assembleSkuData(c.sku.id, c.count);
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

  /**
   * @description: 获取立即购买订单
   * @param {NowPreDto} params
   * @return {*}
   */
  async nowPre(params: NowPreDto): Promise<PreOrderVO> {
    const { skuId, count } = params;
    const sku = await this.assembleSkuData(skuId, count);
    const addressVo = await this.addressService.getDefault();
    return {
      address: addressVo,
      goods: [sku],
      summary: {
        totalPrice: sku.totalPayPrice,
        totalPayPrice: sku.totalPayPrice,
        postFee: 0,
      },
    };
  }

  /**
   * @description: 获取再次购买订单
   * @param {string} id
   * @return {*}
   */
  async repurchase(id: string): Promise<PreOrderVO> {
    const orderVo = await this.findOne(id);
    // 商品信息
    const skus = await Promise.all(
      orderVo.orderSkus.map(async (c) => {
        return await this.assembleSkuData(c.skuId, c.quantity);
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

  /**
   * @description: 创建订单
   * @param {CreateOrderDto} data
   * @return {*}
   */
  async create(data: CreateOrderDto) {
    const { addressId, goods, buyerMessage } = data;
    // 收货人信息
    const addressVo = await this.addressService.findOne(addressId);
    const { receiver, receiverMobile, address } = addressVo;
    const receiverAddress = address;
    // 商品信息
    const orderSkus = await Promise.all(
      goods.map(async (c) => {
        const skuVo = await this.skuService.findOne(c.skuId);
        const sku = {
          spuId: skuVo.product.id,
          skuId: skuVo.id,
          name: skuVo.product.name,
          quantity: c.count,
          curPrice: skuVo.price,
          picture: skuVo.picture,
        };
        const newItem = this.orderSkuRepository.create(sku);
        return await this.orderSkuRepository.save(newItem);
      }),
    );
    const totalMoney = orderSkus.reduce(
      (pre, cur) => (pre += cur.curPrice * cur.quantity),
      0,
    );
    const payMoney = totalMoney;
    const json = {
      receiver,
      receiverMobile,
      receiverAddress,
      buyerMessage,
      orderSkus,
      totalMoney,
      payMoney,
    };
    const newItem = this.orderRepository.create(json);
    return await this.orderRepository.save(newItem);
  }

  /**
   * @description: 用户分页列表
   * @param {CreateOrderDto} query
   * @param {string} memberId
   * @return {*}
   */
  async findAllByMemberId(
    query: OrderListParamsDto,
    memberId: string,
  ): Promise<OrderListVO> {
    const { page, limit, orderState } = query;
    const where: Record<string, any> = {
      isDelete: false,
      member: { id: memberId },
      orderState,
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

  /**
   * @description: 分页列表
   * @param {OrderListParamsDto} query
   * @return {*}
   */
  async findAll(query: OrderListParamsDto): Promise<OrderListVO> {
    const {
      page,
      limit,
      orderNo,
      orderState,
      payChannel,
      receiverMobile,
      createTimeStart,
      createTimeEnd,
    } = query;
    const where: Partial<Record<keyof OrderEntity, any>> = {
      isDelete: false,
      orderState,
      payChannel,
      receiverMobile,
    };
    if (orderNo) {
      where.orderNo = Like(`%${orderNo}%`);
    }
    if (createTimeStart && createTimeEnd) {
      where.createTime = Between(createTimeStart, createTimeEnd);
    }
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

  /**
   * @description: 详情
   * @param {string} id
   * @return {*}
   */
  async findOne(id: string): Promise<OrderVO> {
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的order数据不存在`, 200);
    }
    return item;
  }

  /**
   * @description: 获取订单物流信息
   * @param {string} id
   * @return {*}
   */
  async logistics(id: string): Promise<OrderVO> {
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的order数据不存在`, 200);
    }
    return item;
  }

  /**
   * @description: 确认收货
   * @param {string} id
   * @return {*}
   */
  async receipt(id: string) {
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    item.orderState = OrderState.DaiPingJia;
    return this.orderRepository.save(item);
  }

  /**
   * @description: 订单取消
   * @param {CancelOrderDto} data
   * @return {*}
   */
  async cancel(data: CancelOrderDto) {
    const { id, cancelReason } = data;
    const item = await this.orderRepository.findOne({
      where: { id, isDelete: false },
    });
    item.orderState = OrderState.YiQuXiao;
    item.cancelReason = cancelReason;
    return this.orderRepository.save(item);
  }

  /**
   * @description: 刪除
   * @param {string} id
   * @return {*}
   */
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
