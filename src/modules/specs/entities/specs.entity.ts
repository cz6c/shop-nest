import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';

@Entity('specs')
export class SpecsEntity extends CommonEntity {
  /** 规格名称 */
  @Column({ default: '' })
  name: string;

  /** 规格值数组 */
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  options: string[];

  /** 多对一商品 */
  @ManyToOne(() => ProductEntity, (product) => product.specs)
  product: ProductEntity;
}
