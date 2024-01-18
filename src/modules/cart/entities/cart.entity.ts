export class Cart {}
import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';
import { MemberEntity } from '@/modules/member/entities/member.entity';

@Entity('cart')
export class CartEntity extends CommonEntity {
  /** 数量 */
  @Column({ default: 0 })
  count: number;

  /** 是否选中 */
  @Column({ default: false })
  selected: boolean;

  /** 多对一sku */
  @ManyToOne(() => SkuEntity, (entity) => entity.carts)
  sku: SkuEntity;

  /** 多对一user */
  @ManyToOne(() => MemberEntity, (entity) => entity.carts)
  member: MemberEntity;
}
