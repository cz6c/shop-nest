import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ArticleEntity } from './entities/article.entity';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleVO,
  ArticleListVO,
  ArticleListParamsDto,
} from './dto/index.dto';
import { CategoryEntity } from '@/modules/category/entities/category.entity';
import { TagEntity } from '@/modules/tag/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}

  // 创建
  async create(data: CreateArticleDto, userId: number) {
    const { title, categoryId, tagIds } = data;
    const item = await this.articleRepository.findOne({
      where: { title, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${title}已存在`, 200);
    }
    // 根据分类id获取分类
    const categoryDoc = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    // 根据标签id获取标签
    const ids = tagIds.map((id) => ({ id }));
    const tagDocs = await this.tagRepository.findBy(ids);
    const newItem = this.articleRepository.create({
      ...data,
      category: categoryDoc,
      tags: tagDocs,
      author: { id: userId },
    });
    return await this.articleRepository.save(newItem);
  }

  // 列表
  async findAll(query: ArticleListParamsDto): Promise<ArticleListVO> {
    // const qb = this.articleRepository
    //   .createQueryBuilder('article')
    //   .leftJoinAndSelect('article.category', 'category') // 需链表查询的字段 查询的表
    //   .leftJoinAndSelect('article.tags', 'tag')
    //   .leftJoinAndSelect('article.author', 'user');

    // const { title, page = 1, limit = 10 } = query;
    // // title && qb.where('article.title = :title', { title });
    // title && qb.where('article.title LIKE :title', { title: `%${title}%` });
    // qb.orderBy('article.createTime', 'DESC');

    // const total = await qb.getCount();
    // qb.limit(limit);
    // qb.offset(limit * (page - 1));

    // const arr = await qb.getMany();
    // const list = arr.map((x) => x.entityToVo());
    // return { list, page, limit, total };

    const { title, page, limit } = query;
    const where: Record<string, any> = { isDelete: false };
    if (title) {
      where.title = Like(`%${title}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.articleRepository.findAndCount({
      relations: ['category', 'tags', 'author'], // 需链表查询的字段
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list: list.map((x) => x.entityToVo()), page, limit, total };
  }

  // 详情
  async findOne(id: number): Promise<ArticleVO> {
    const item = await this.articleRepository.findOne({
      where: { id, isDelete: false },
      relations: ['category', 'tags', 'author'], // 需链表查询的字段
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item.entityToVo();
  }

  // 更新
  async update(data: UpdateArticleDto) {
    const { id, categoryId, tagIds } = data;
    const item = await this.articleRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    // 根据分类id获取分类
    const categoryDoc = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    // 根据标签id获取标签
    const ids = tagIds.map((id) => ({ id }));
    const tagDocs = await this.tagRepository.findBy(ids);
    const newItem = this.articleRepository.create({
      ...data,
      category: categoryDoc,
      tags: tagDocs,
    });
    const updateItem = this.articleRepository.merge(item, newItem);
    return this.articleRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
    const item = await this.articleRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.articleRepository.remove(item);
    item.isDelete = true;
    return this.articleRepository.save(item);
  }
}
