import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { OrderState, PayChannel } from '@/common/common.enum';

// 新增
export class CreateOrderDto {
  /** 所选地址Id */
  @ApiProperty({ description: '所选地址Id' })
  @IsString()
  @IsNotEmpty()
  addressId: string;

  /** 商品集合[ 商品信息 ] */
  @ApiProperty({ description: '商品集合[ 商品信息 ]' })
  @IsNotEmpty()
  @IsArray()
  goods: {
    /** 数量 */
    count: number;
    /** skuId */
    skuId: string;
  }[];

  /** 订单备注 */
  @ApiProperty({ description: '订单备注' })
  @IsString()
  buyerMessage: string;

  /** 支付渠道，1支付宝、2微信 */
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

// 更新
export class UpdateOrderDto extends IntersectionType(IdDto, CreateOrderDto) {}

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
}

// 分页列表
export class OrderListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [OrderVO], description: '列表' })
  readonly list: OrderVO[];
}

// 列表查询
export class OrderListParamsDto extends PaginationDto {
  @ApiProperty({ description: '订单编号' })
  @IsString()
  readonly orderNo: string;

  @ApiProperty({
    description:
      '订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消',
  })
  @IsEnum(OrderState)
  readonly orderState: OrderState;

  @ApiProperty({ description: '收货人手机' })
  @IsString()
  readonly receiverMobile: string;
}
