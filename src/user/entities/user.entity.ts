import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { ArticleEntity } from '@/modules/article/entities/article.entity';
import { FollowEntity } from './follow.entity';
import { QINIU } from '#/index';

@Entity('user')
export class UserEntity extends CommonEntity {
  @Column({ nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  nickname: string;

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
  avatar: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  @OneToMany(() => ArticleEntity, (entity) => entity.author)
  articles: ArticleEntity[];

  @ManyToOne(() => FollowEntity, (entity) => entity.users)
  follow: FollowEntity;
}
