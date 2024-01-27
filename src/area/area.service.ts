import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AreaEntity, CityEntity, ProvinceEntity } from './entities/area.entity';
import { AeraListParamsDto } from './dto/index.dto';
import { listToTree } from '@/utils/tree';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(AreaEntity)
    private readonly areaRepository: Repository<AreaEntity>,
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
    @InjectRepository(ProvinceEntity)
    private readonly provinceRepository: Repository<ProvinceEntity>,
  ) {}

  // trees列表
  async findTrees() {
    const provinceList = (await this.provinceRepository.find()).map((c) => ({
      name: c.name,
      code: c.code,
      parentCode: null,
    }));
    const cityList = (await this.cityRepository.find()).map((c) => ({
      name: c.name,
      code: c.code,
      parentCode: c.provinceCode,
    }));
    const areaList = (await this.areaRepository.find()).map((c) => ({
      name: c.name,
      code: c.code,
      parentCode: c.cityCode,
    }));
    return listToTree([...provinceList, ...cityList, ...areaList], {
      pid: 'parentCode',
      id: 'code',
    });
  }

  // 通过code和层级查地址列表
  async findAllChildrenByCode(params: AeraListParamsDto) {
    if (params.level === 1) {
      const list = await this.provinceRepository.find();
      return { list };
    }
    if (params.level === 2) {
      const list = await this.cityRepository.find({
        where: { provinceCode: params.code },
      });
      return { list };
    }
    if (params.level === 3) {
      const list = await this.areaRepository.find({
        where: { cityCode: params.code },
      });
      return { list };
    }
  }

  // 地址详情
  async findOne(code: string, type: 'province' | 'city' | 'area') {
    const typeMap = {
      province: this.provinceRepository,
      city: this.cityRepository,
      area: this.areaRepository,
    };
    const item = await typeMap[type].findOne({
      where: { code },
    });
    if (!item) {
      throw new HttpException(`code为${code}的${type}数据不存在`, 200);
    }
    return item;
  }
}
