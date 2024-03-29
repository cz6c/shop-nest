import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { OrderState, PayChannel } from '@/common/common.enum';
import { MemberEntity } from '@/modules/member/entities/member.entity';

@Entity('order')
export class OrderEntity extends CommonEntity {
  /** 订单编号 */
  @Column({ default: '' })
  orderNo: string;

  /** 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消 */
  @Column({
    type: 'enum',
    enum: OrderState,
    default: OrderState.DaiFuKuan,
  })
  orderState: OrderState;

  /** 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束 */
  @Column({ default: 900 })
  countdown: number;

  /** 收货人 */
  @Column({ default: '' })
  receiver: string;

  /** 收货人手机 */
  @Column({ default: '' })
  receiverMobile: string;

  /** 收货人完整地址 */
  @Column({ default: '' })
  receiverAddress: string;

  /** 商品总价 */
  @Column({ type: 'float', precision: 2, default: 0 })
  totalMoney: number;

  /** 运费 */
  @Column({ type: 'float', precision: 2, default: 0 })
  postFee: number;

  /** 应付金额 */
  @Column({ type: 'float', precision: 2, default: 0 })
  payMoney: number;

  /** 订单备注 */
  @Column({ default: '' })
  buyerMessage: string;

  /** 支付渠道：支付渠道，1支付宝、2微信 */
  @Column({
    type: 'enum',
    enum: PayChannel,
    default: PayChannel.Alipay,
  })
  payChannel: PayChannel;

  /** 订单取消原因 */
  @Column({ default: '' })
  cancelReason: string;

  /** 一对多 */
  @OneToMany(() => OrderSkuEntity, (entity) => entity.order)
  orderSkus: OrderSkuEntity[];

  /** 多对一u */
  @ManyToOne(() => MemberEntity, (entity) => entity.orders)
  member: MemberEntity;
}

@Entity('order_sku')
export class OrderSkuEntity extends CommonEntity {
  /** 商品 id */
  @Column({ default: '' })
  spuId: string;

  /** 购买时商品名称 */
  @Column({ default: '' })
  name: string;

  /** 数量 */
  @Column({ default: 0 })
  quantity: number;

  /** sku id */
  @Column({ default: '' })
  skuId: string;

  /** 购买时单价 */
  @Column({ type: 'float', precision: 2, default: 0 })
  curPrice: number;

  /** 购买时sku图片 */
  @Column({ default: '' })
  picture: string;

  /** 多对一 */
  @ManyToOne(() => OrderEntity, (entity) => entity.orderSkus)
  order: OrderEntity;
}
