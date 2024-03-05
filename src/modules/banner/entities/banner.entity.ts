import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { QINIU } from '#/index';

@Entity('banner')
export class BannerEntity extends CommonEntity {
  /** 跳转链接 */
  @Column({ default: '' })
  hrefUrl: string;

  /** 图片链接 */
  @Column({
    default: '',
    transformer: {
      to(value) {
        return value ? value.replace(QINIU.DOMAIN, '') : '';
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

  /** 备注 */
  @Column({ default: '' })
  remark: string;

  /** 状态 */
  @Column({ default: false })
  status: boolean;
}
