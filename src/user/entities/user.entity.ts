import { Entity, Column } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { QINIU } from '#/index';
import { Gender } from '@/common/common.enum';

@Entity('user')
export class UserEntity extends CommonEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ default: '' })
  nickname: string;

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
  avatar: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  /** 性别 */
  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MEN,
  })
  gender: Gender;

  /** 职位 */
  @Column({ default: '' })
  profession: string;
}
