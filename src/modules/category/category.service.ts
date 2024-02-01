import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from './entities/category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryListParamsDto,
} from './dto/index.dto';
import { listToTree } from '@/utils/tree';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // 创建
  async create(data: CreateCategoryDto) {
    const { name, parentId } = data;
    const item = await this.categoryRepository.findOne({
      where: { name, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${name}已存在`, 200);
    }
    const newItem = this.categoryRepository.create(data);
    const parent = await this.categoryRepository.findOne({
      where: { id: parentId, isDelete: false },
    });
    newItem.parentId = parent ? parentId : null;
    return await this.categoryRepository.save(newItem);
  }

  // trees
  async findTrees() {
    const list = await this.categoryRepository.find({
      where: { isDelete: false },
    });
    return listToTree(list, { pid: 'parentId' });
  }

  // 通过 parentId 查子列表
  async findAllChildrenByParentId(query: CategoryListParamsDto) {
    const { parentId } = query;
    return this.categoryRepository.find({
      where: { parentId, isDelete: false },
    });
  }

  // 详情
  async findOne(id: string) {
    const item = await this.categoryRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateCategoryDto) {
    const { id, parentId = '' } = data;
    const item = await this.categoryRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    const parent = await this.categoryRepository.findOne({
      where: { id: parentId, isDelete: false },
    });
    if (!parent) {
      throw new HttpException(`${parentId}实体不存在`, 200);
    }
    const updateItem = this.categoryRepository.merge(item, data);
    return this.categoryRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.categoryRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    // return await this.categoryRepository.remove(item);
    item.isDelete = true;
    return this.categoryRepository.save(item);
  }
}
