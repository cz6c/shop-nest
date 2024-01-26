import { Column, Entity } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';

@Entity('specification')
export class SpecificationEntity extends CommonEntity {
  /** 规格名称 */
  @Column({ default: '' })
  name: string;

  /** 规格值数组 */
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  options: string[];
}
