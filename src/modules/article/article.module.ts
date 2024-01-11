import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { CategoryEntity } from '@/modules/category/entities/category.entity';
import { TagEntity } from '@/modules/tag/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, CategoryEntity, TagEntity]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
