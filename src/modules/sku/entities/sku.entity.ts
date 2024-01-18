import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { CartEntity } from '@/modules/cart/entities/cart.entity';
import { ProductEntity } from '@/modules/product/entities/product.entity';

@Entity('sku')
export class SkuEntity extends CommonEntity {
  /** sku名称 */
  @Column({ default: '' })
  skuName: string;

  /** 库存 */
  @Column({ default: 0 })
  inventory: number;

  /** 当前价格 */
  @Column({ default: 0 })
  price: number;

  /** sku图片 */
  @Column({ default: '' })
  picture: string;

  /** sku编码 */
  @Column({ default: '' })
  skuCode: string;

  /** 规格集合[ 规格信息 ] */
  @Column({ default: '' })
  specs: string;

  /** 多对一商品 */
  @ManyToOne(() => ProductEntity, (entity) => entity.skus)
  product: ProductEntity;

  /** 一对多购物车 */
  @OneToMany(() => CartEntity, (entity) => entity.sku)
  carts: CartEntity[];
}
