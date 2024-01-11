import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { UserEntity } from '@/user/entities/user.entity';
import { CategoryEntity } from '@/modules/category/entities/category.entity';
import { TagEntity } from '@/modules/tag/entities/tag.entity';
import { ArticleVO } from '../dto/index.dto';
import { QINIU } from '#/index';

@Entity('article')
export class ArticleEntity extends CommonEntity {
  @Column({ nullable: true })
  title: string;

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
  coverUrl: string;

  @Column({ nullable: true })
  htmlContent: string;

  @ManyToOne(() => UserEntity, (user) => user.articles, {
    // createForeignKeyConstraints: false, //去除物理外键束缚
  })
  @JoinColumn()
  author: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.articles)
  @JoinColumn()
  category: CategoryEntity;

  @ManyToMany(() => TagEntity, (tag) => tag.articles)
  @JoinTable()
  tags: TagEntity[];

  entityToVo(): ArticleVO {
    const { id, title, coverUrl, htmlContent, tags, createTime, updateTime } =
      this;
    return {
      id,
      title,
      coverUrl,
      htmlContent,
      createTime,
      updateTime,
      tags: tags.filter(({ isDelete }) => !isDelete),
      authorId: this.author?.id ?? 0,
      authorName: (this.author?.nickname || this.author?.username) ?? '',
      categoryId: this.category?.id ?? 0,
      categoryName: this.category?.name ?? '',
    };
  }
}
