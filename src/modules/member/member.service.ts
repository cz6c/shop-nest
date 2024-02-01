import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MemberEntity } from './entities/member.entity';
import {
  CreateMemberDto,
  UpdateMemberDto,
  MemberListVO,
  MemberListParamsDto,
} from './dto/index.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  // 创建
  async create(data: CreateMemberDto) {
    const { username } = data;
    const item = await this.memberRepository.findOne({
      where: { username, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${username}已存在`, 200);
    }
    const newItem = this.memberRepository.create(data);
    return await this.memberRepository.save(newItem);
  }

  // 列表
  async findAll(query: MemberListParamsDto): Promise<MemberListVO> {
    const { nickname, page, limit } = query;
    const where: Record<string, any> = { isDelete: false };
    if (nickname) {
      where.nickname = Like(`%${nickname}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.memberRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: string) {
    const item = await this.memberRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的member数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateMemberDto, id: string) {
    const item = await this.memberRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的member数据不存在`, 200);
    }
    const updateItem = this.memberRepository.merge(item, data);
    return this.memberRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.memberRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的member数据不存在`, 400);
    }
    // return await this.memberRepository.remove(item);
    item.isDelete = true;
    return this.memberRepository.save(item);
  }

  // 通过账号查询密码
  async findByMembername(username: string) {
    const member = await this.memberRepository.findOne({
      where: { username, isDelete: false },
      select: ['password', 'id'],
    });
    if (!member) {
      throw new HttpException('用户名不正确！', 400);
    }
    const { password, id } = member;
    return { username, password, id };
  }
}
