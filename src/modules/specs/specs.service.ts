import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SpecsEntity } from './entities/specs.entity';
import { CreateSpecsDto, UpdateSpecsDto } from './dto/index.dto';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecsEntity)
    private readonly specsRepository: Repository<SpecsEntity>,
  ) {}

  // 创建
  async batchCreate(data: CreateSpecsDto[]) {
    const newItem = this.specsRepository.create(data);
    return await this.specsRepository.save(newItem);
  }

  async batchUpdate(data: UpdateSpecsDto[], product: ProductEntity) {
    // 有新增则新增
    const newdata = data.filter((c) => !c.id).map((x) => ({ ...x, product }));
    const newItems = newdata.length ? await this.batchCreate(newdata) : [];
    // 其他的更新
    const updateData = data.filter((c) => c.id);
    const updateItems = await Promise.all(
      updateData.map(async (c) => {
        const { id } = c;
        const item = await this.specsRepository.findOne({
          where: { id },
        });
        const updateItem = this.specsRepository.merge(item, c);
        return await this.specsRepository.save(updateItem);
      }),
    );
    return [...newItems, ...updateItems];
  }

  // 刪除
  async removes(ids: number[]) {
    const items = await this.specsRepository.findBy({
      id: In(ids),
    });
    items.forEach((c) => (c.isDelete = true));
    return await this.specsRepository.save(items);
  }
}
