import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { UserEntity } from '@/user/entities/user.entity';

@Entity('address')
export class AddressEntity extends CommonEntity {
  @Column({ nullable: true })
  receiver: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ nullable: true })
  provinceCode: string;

  @Column({ nullable: true })
  cityCode: string;

  @Column({ nullable: true })
  countyCode: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, (entity) => entity.address)
  user: UserEntity;
}
