import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, UserPayload, wxLoginDto } from './dto/auth.dto';
import { MemberService } from '@/modules/member/member.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
  ) {}

  async login(user: UserPayload) {
    console.log('payload', user);
    return {
      token: this.jwtService.sign(user),
    };
  }

  async memberLogin({ username, password }: LoginDto) {
    const member = await this.memberService.findByMembername(username);

    console.log('member', member);

    if (password !== member.password) {
      throw new HttpException('密码错误！', 400);
    }

    return this.login({
      username,
      userId: '',
      memberId: member.id,
    });
  }

  async wxLogin(data: wxLoginDto) {
    console.log(data);
  }
}
