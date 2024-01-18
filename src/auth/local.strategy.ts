import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserPayload } from './dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly userService: UserService) {
    super();
  }

  // 验证账号密码正确性
  async validate(username: string, password: string): Promise<UserPayload> {
    const user = await this.userService.findByUsername(username);

    console.log('user', user);

    if (password !== user.password) {
      throw new HttpException('密码错误！', 400);
    }

    return { username, userId: user.id, memberId: 0 };
  }
}
