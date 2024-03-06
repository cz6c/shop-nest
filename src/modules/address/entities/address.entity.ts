import { Entity, Column, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { MemberEntity } from '@/modules/member/entities/member.entity';

@Entity('address')
export class AddressEntity extends CommonEntity {
  /** 收货人姓名 */
  @Column({ default: '' })
  receiver: string;

  /** 收货人联系方式 */
  @Column({ default: '' })
  receiverMobile: string;

  /** 省code */
  @Column({ default: '' })
  provinceCode: string;

  /** 市code */
  @Column({ default: '' })
  cityCode: string;

  /** 区/县code */
  @Column({ default: '' })
  countyCode: string;

  /** 收货人详细地址 */
  @Column({ default: '' })
  address: string;

  /** 是否设置为默认地址 */
  @Column({ default: false })
  isDefault: boolean;

  /** 多对一user */
  @ManyToOne(() => MemberEntity, (entity) => entity.addresss)
  member: MemberEntity;
}
