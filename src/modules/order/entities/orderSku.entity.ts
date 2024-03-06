import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { OrderEntity } from './order.entity';

@Entity('order_sku')
export class OrderSkuEntity extends CommonEntity {
  /** 商品 id */
  @Column({ default: '' })
  spuId: string;

  /** 商品名称 */
  @Column({ default: '' })
  name: string;

  /** 数量 */
  @Column({ default: 0 })
  quantity: number;

  /** 购买时单价 */
  @Column({ type: 'float', precision: 2, default: 0 })
  curPrice: number;

  /** sku图片 */
  @Column({ default: '' })
  picture: string;

  /** 多对一 */
  @ManyToOne(() => OrderEntity, (entity) => entity.orderSkus)
  order: OrderEntity;
}
