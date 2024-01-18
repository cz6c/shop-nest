import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';

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

  /** 多对多商品 */
  @ManyToMany(() => ProductEntity, (product) => product.specs)
  @JoinTable()
  product: ProductEntity[];
}
