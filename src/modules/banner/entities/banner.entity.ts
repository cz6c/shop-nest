import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';
import { SpecificationEntity } from '@/modules/specification/entities/specification.entity';
import { QINIU } from '#/index';
import { CategoryEntity } from '@/modules/category/entities/category.entity';

@Entity('banner')
export class BannerEntity extends CommonEntity {
  /** 跳转链接 */
  @Column({ default: '' })
  hrefUrl: string;

  /** 图片链接 */
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
  imgUrl: string;

  /** 排序 */
  @Column({ default: 0 })
  sortNum: number;
}
