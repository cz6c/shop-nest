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
  UpdateFollowDto,
  FollowVo,
} from './dto/index.dto';
import { FollowEntity } from './entities/follow.entity';
import { UserDto } from '@/auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

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
  async findOne(id: number): Promise<UserVO> {
    const item = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!item) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    return item;
  }

  // 更新
  async update(data: UpdateUserDto, id: number) {
    const item = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    const updateItem = this.userRepository.merge(item, data);
    return this.userRepository.save(updateItem);
  }

  // 刪除
  async remove(id: number) {
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
      relations: ['follow'],
      select: ['password', 'id', 'follow'],
    });
    if (!user) {
      throw new HttpException('用户名不正确！', 400);
    }
    const { password, id, follow } = user;
    return { username, password, id, followId: follow?.id ?? 0 };
  }

  // 绑定关系
  async follow(id: number, user: UserDto) {
    if (user.followId) {
      throw new HttpException(`你已存在绑定关系`, 200);
    }
    if (id === user.id) {
      throw new HttpException(`不能绑定自己`, 200);
    }
    const toUser = await this.userRepository.findOne({
      where: { id, isDelete: false },
    });
    if (!toUser) {
      throw new HttpException(`id为${id}的数据不存在`, 200);
    }
    const fromUser = await this.userRepository.findOne({
      where: { id: user.id, isDelete: false },
    });
    if (fromUser.follow?.id) {
      throw new HttpException(`该用户已存在绑定关系`, 200);
    }
    const newItem = this.followRepository.create({
      users: [toUser, fromUser],
    });
    return await this.followRepository.save(newItem);
  }

  // 获取绑定详情
  async getFollow(followId: number): Promise<FollowVo> {
    const item = await this.followRepository.findOne({
      where: { id: followId, isDelete: false },
      relations: ['users'],
    });
    if (!item) {
      throw new HttpException(`id为${followId}的数据不存在`, 200);
    }
    return item;
  }

  // 更新绑定信息
  async updateFollow(params: UpdateFollowDto, followId: number) {
    const item = await this.followRepository.findOne({
      where: { id: followId, isDelete: false },
    });
    const updateItem = this.followRepository.merge(item, params);
    return this.followRepository.save(updateItem);
  }
}
