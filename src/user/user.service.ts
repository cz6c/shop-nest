import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  UserVO,
  UserListVO,
  UserListParamsDto,
  RegisterUserDto,
} from './dto/index.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // 注册
  async register(data: RegisterUserDto) {
    const { username } = data;
    const item = await this.userRepository.findOne({
      where: { username, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${username}已存在`, 200);
    }
    const newItem = this.userRepository.create(data);
    return await this.userRepository.save(newItem);
  }

  // 创建
  async create(data: CreateUserDto) {
    const { username } = data;
    const item = await this.userRepository.findOne({
      where: { username, isDelete: false },
    });
    if (item) {
      throw new HttpException(`${username}已存在`, 200);
    }
    const newItem = this.userRepository.create(data);
    return await this.userRepository.save(newItem);
  }

  // 列表
  async findAll(query: UserListParamsDto): Promise<UserListVO> {
    const { nickname, page, limit } = query;
    const where: Record<string, any> = { isDelete: false };
    if (nickname) {
      where.nickname = Like(`%${nickname}%`);
    }
    const skip = (page && limit && (page - 1) * limit) ?? 0;
    const take = limit ?? 0;
    const [list, total] = await this.userRepository.findAndCount({
      where,
      order: { updateTime: 'DESC' },
      skip,
      take,
    });
    return { list, page, limit, total };
  }

  // 详情
  async findOne(id: string): Promise<UserVO> {
    const item = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateUserDto, id: string) {
    const item = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.userRepository.merge(item, data);
    return this.userRepository.save(updateItem);
  }

  // 刪除
  async remove(id: string) {
    const item = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 400);
    }
    // return await this.userRepository.remove(item);
    item.isDelete = true;
    return this.userRepository.save(item);
  }

  // 通过账号查询密码
  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username, isDelete: false },
      select: ['password', 'id'],
    });
    if (!user) {
      throw new HttpException('用户名不正确！', 400);
    }
    const { password, id } = user;
    return { username, password, id };
  }
}
