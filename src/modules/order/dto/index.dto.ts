import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { OrderState, PayChannel } from '@/common/common.enum';
import { AddressVO } from '@/modules/address/dto/index.dto';
import { OrderSkuEntity } from '../entities/order.entity';

export class NowPreDto {
  @ApiProperty({ description: '所选地址Id' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ description: 'skuId' })
  @IsString()
  skuId: string;

  @ApiProperty({ description: '数量' })
  @IsNumber()
  count: number;
}

export class PreOrderGoodsItem {
  /** 属性文字，例如“颜色:瓷白色 尺寸：8寸” */
  attrsText: string;
  /** 数量 */
  count: number;
  /** spuId */
  spuId: string;
  /** 商品名称 */
  name: string;
  /** 实付单价 */
  payPrice: number;
  /** 图片 */
  picture: string;
  /** SKUID */
  skuId: string;
  /** 实付价格小计 */
  totalPayPrice: number;
}

export class PreOrderVO {
  /** 用户地址列表 [ 地址信息 ] */
  address: AddressVO;
  /** 商品集合 [ 商品信息 ] */
  goods: PreOrderGoodsItem[];
  /** 结算信息 */
  summary: {
    /** 商品总价 */
    totalPrice: number;
    /** 邮费 */
    postFee: number;
    /** 应付金额 */
    totalPayPrice: number;
  };
}

// 新增
export class CreateOrderDto {
  @ApiProperty({ description: '所选地址Id' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ description: '商品集合[ 商品信息 ]' })
  @IsNotEmpty()
  @IsArray()
  goods: {
    /** 数量 */
    count: number;
    /** skuId */
    skuId: string;
  }[];

  @ApiProperty({ description: '订单备注' })
  @IsString()
  buyerMessage: string;

  @ApiProperty({ description: '支付渠道，1支付宝、2微信' })
  @IsEnum(PayChannel)
  payChannel: PayChannel;

  // @ApiProperty({ description: '运费' })
  // @IsNumber()
  // readonly postFee: number;

  // @ApiProperty({ description: '商品总价' })
  // @IsNumber()
  // readonly totalMoney: number;

  // @ApiProperty({ description: '应付金额' })
  // @IsNumber()
  // readonly payMoney: number;
}

/** 取消订单 */
export class CancelOrderDto extends IdDto {
  @ApiProperty({ description: '取消原因' })
  @IsString()
  cancelReason: string;
}

// 详情
export class OrderVO extends CommonVO {
  @ApiPropertyOptional({ description: '订单编号' })
  readonly orderNo: string;

  @ApiPropertyOptional({
    description:
      '订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消',
  })
  readonly orderState: OrderState;

  @ApiPropertyOptional({
    description: '倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束',
  })
  readonly countdown: number;

  @ApiPropertyOptional({ description: '收货人' })
  readonly receiver: string;

  @ApiPropertyOptional({ description: '收货人手机' })
  readonly receiverMobile: string;

  @ApiPropertyOptional({ description: '收货人完整地址' })
  readonly receiverAddress: string;

  @ApiPropertyOptional({ description: '运费' })
  readonly postFee: number;

  @ApiPropertyOptional({ description: '商品总价' })
  readonly totalMoney: number;

  @ApiPropertyOptional({ description: '应付金额' })
  readonly payMoney: number;

  @ApiPropertyOptional({ description: '订单备注' })
  readonly buyerMessage: string;

  @ApiPropertyOptional({ description: '支付渠道，1支付宝、2微信' })
  readonly payChannel: PayChannel;

  @ApiPropertyOptional({ description: '商品信息' })
  readonly orderSkus: OrderSkuEntity[];
}

/** 分页列表 */
export class OrderListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [OrderVO], description: '列表' })
  readonly list: OrderVO[];
}

/** 列表查询 */
export class OrderListParamsDto extends PaginationDto {
  /** 订单编号 */
  @ApiPropertyOptional({ description: '订单编号' })
  @IsString()
  @IsOptional()
  readonly orderNo: string;

  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  @ApiPropertyOptional({
    description:
      '订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消',
  })
  @IsEnum(OrderState)
  @IsOptional()
  readonly orderState: OrderState;

  /** 支付渠道，1支付宝、2微信 */
  @ApiPropertyOptional({ description: '支付渠道，1支付宝、2微信' })
  @IsEnum(PayChannel)
  @IsOptional()
  readonly payChannel: PayChannel;

  /** 收货人手机 */
  @ApiPropertyOptional({ description: '收货人手机' })
  @IsString()
  @IsOptional()
  readonly receiverMobile: string;

  /** 下单时间开始 */
  @ApiPropertyOptional({ description: '下单时间开始' })
  @IsDate()
  @IsOptional()
  readonly createTimeStart: Date;

  /** 下单时间结束 */
  @ApiPropertyOptional({ description: '下单时间结束' })
  @IsDate()
  @IsOptional()
  readonly createTimeEnd: Date;
}
