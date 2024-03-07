import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { QINIU } from '#/index';
import { Gender } from '@/common/common.enum';
import { AddressEntity } from '@/modules/address/entities/address.entity';
import { CartEntity } from '@/modules/cart/entities/cart.entity';
import { OrderEntity } from '@/modules/order/entities/order.entity';

@Entity('member')
export class MemberEntity extends CommonEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  nickname: string;

  @Column({
    default: '',
    transformer: {
      to(value) {
        return value ? value.replace(QINIU.DOMAIN, '') : '';
      },
      from(value) {
        return value ? `${QINIU.DOMAIN}${value}` : '';
      },
    },
  })
  avatar: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  /** 性别 */
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MEN,
  })
  gender: Gender;

  /** 职位 */
  @Column({ default: '' })
  profession: string;

  /** 一对多地址 */
  @OneToMany(() => AddressEntity, (entity) => entity.member)
  addresss: AddressEntity[];

  /** 一对多购物车 */
  @OneToMany(() => CartEntity, (entity) => entity.member)
  carts: CartEntity[];

  /** 一对多 */
  @OneToMany(() => OrderEntity, (entity) => entity.member)
  orders: OrderEntity[];
}
