import { Entity, Column, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { QINIU } from '#/index';
import { UserGender } from '@/common/common.enum';
import { AddressEntity } from '@/modules/address/entities/address.entity';
import { CartEntity } from '@/modules/cart/entities/cart.entity';

@Entity('user')
export class UserEntity extends CommonEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  nickname: string;

  @Column({
    nullable: true,
    transformer: {
      to(value) {
        return value.replace(QINIU.DOMAIN, '');
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
    enum: UserGender,
    default: UserGender.MEN,
  })
  gender: UserGender;

  /** 职位 */
  @Column({ default: '' })
  profession: string;

  /** 一对多地址 */
  @OneToMany(() => AddressEntity, (entity) => entity.user)
  addresss: AddressEntity[];

  /** 一对多购物车 */
  @OneToMany(() => CartEntity, (entity) => entity.user)
  carts: CartEntity[];
}
