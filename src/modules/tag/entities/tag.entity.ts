import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@/common/common.entity';
import { ArticleEntity } from '@/modules/article/entities/article.entity';

@Entity('tag')
export class TagEntity extends CommonEntity {
  @Column({ nullable: true })
  name: string;

  @OneToMany(() => ArticleEntity, (article) => article.tags)
  articles: ArticleEntity[];
}
