import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';
import { SpecsEntity } from '@/modules/specs/entities/specs.entity';
import { QINIU } from '#/index';
import { CategoryEntity } from '@/modules/category/entities/category.entity';

@Entity('product')
export class ProductEntity extends CommonEntity {
  /** 商品名称 */
  @Column({ default: '' })
  name: string;

  /** 商品编码 */
  @Column({ default: '' })
  spuCode: string;

  /** 商品描述 */
  @Column({ default: '' })
  desc: string;

  /** 当前价格 */
  @Column({ type: 'float', precision: 2, default: 0 })
  price: number;

  /** 主图图片集合[ 主图图片链接 ] */
  @Column({
    type: 'simple-array',
    nullable: true,
    transformer: {
      to(value) {
        return value.map((c: string) => c.replace(QINIU.DOMAIN, ''));
      },
      from(value) {
        return value ? value.map((c: string) => `${QINIU.DOMAIN}${c}`) : [];
      },
    },
  })
  mainPictures: string[];

  /** 商品详情图片集合[ 图片链接 ] */
  @Column({
    type: 'simple-array',
    nullable: true,
    transformer: {
      to(value) {
        return value.map((c: string) => c.replace(QINIU.DOMAIN, ''));
      },
      from(value) {
        return value ? value.map((c: string) => `${QINIU.DOMAIN}${c}`) : [];
      },
    },
  })
  pictures: string[];

  /** 商品状态 */
  @Column({ default: false })
  status: boolean;

  /** 销量 */
  @Column({ default: 0 })
  salesCount: number;

  /** 一对多sku */
  @OneToMany(() => SkuEntity, (entity) => entity.product)
  skus: SkuEntity[];

  /** 一对多规格 */
  @OneToMany(() => SpecsEntity, (entity) => entity.product)
  specs: SpecsEntity[];

  /** 多对一分类 */
  @ManyToOne(() => CategoryEntity, (entity) => entity.products)
  category: CategoryEntity;
}
