import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecsEntity } from './entities/specs.entity';
import { CreateSpecsDto, UpdateSpecsDto } from './dto/index.dto';

@Injectable()
export class SpecsService {
  constructor(
    @InjectRepository(SpecsEntity)
    private readonly specsRepository: Repository<SpecsEntity>,
  ) {}

  // 创建
  async create(data: CreateSpecsDto) {
    const newItem = this.specsRepository.create(data);
    return await this.specsRepository.save(newItem);
  }

  async batchCreate(data: CreateSpecsDto[]) {
    const newItem = this.specsRepository.create(data);
    return await this.specsRepository.save(newItem);
  }

  // 更新
  async update(data: UpdateSpecsDto) {
    const { id } = data;
    const item = await this.specsRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.specsRepository.merge(item, data);
    return this.specsRepository.save(updateItem);
  }

  // async batchUpdate(data: UpdateSpecsDto[]) {
  //   const list = data.map(async (c) => {
  //     const { id } = c;
  //     const item = await this.specsRepository.findOne({
  //       where: { id, isDelete: false },
  //     });
  //     return this.specsRepository.merge(item, c);
  //   });
  //   return this.specsRepository.save(list);
  // }
}
