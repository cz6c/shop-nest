import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, UserPayload } from './dto/auth.dto';
import { MemberEntity } from '@/modules/member/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  async login(user: UserPayload) {
    console.log('payload', user);
    return {
      token: this.jwtService.sign(user),
    };
  }

  async memberLogin({ username, password }: LoginDto) {
    const member = await this.memberRepository.findOne({
      where: { username, isDelete: false },
      select: ['username', 'password', 'id'],
    });
    if (!member) {
      throw new HttpException('用户名不正确！', 400);
    }

    console.log('member', member);

    if (password !== member.password) {
      throw new HttpException('密码错误！', 400);
    }

    return this.login({
      username,
      userId: 0,
      memberId: member.id,
    });
  }
}
