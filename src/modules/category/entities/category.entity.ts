import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';

@Entity('category')
export class CategoryEntity extends CommonEntity {
  /** 分类名称 */
  @Column({ default: '' })
  name: string;

  /** 父级分类id */
  @Column({ nullable: true })
  parentId: number;

  /** 一对多商品 */
  @OneToMany(() => ProductEntity, (entity) => entity.category)
  products: ProductEntity[];
}
