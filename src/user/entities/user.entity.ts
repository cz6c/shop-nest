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

  @Column({ nullable: true })
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

  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.MEN,
  })
  gender: UserGender;

  @Column({ nullable: true })
  profession: string;

  @OneToMany(() => AddressEntity, (entity) => entity.user)
  address: AddressEntity[];

  @OneToMany(() => CartEntity, (entity) => entity.user)
  cart: CartEntity[];
}
