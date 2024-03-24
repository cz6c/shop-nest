import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto, wxLoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@/decorator/public-auth.decorator';
import { UserPayload } from './dto/auth.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiBearerAuth()
@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: '后台登录' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() data: LoginDto, @GetUser() user: UserPayload) {
    return await this.authService.login(user);
  }

  @Public()
  @ApiOperation({ summary: '会员登录' })
  @Post('memberLogin')
  async memberLogin(@Body() data: LoginDto) {
    return await this.authService.memberLogin(data);
  }

  @Public()
  @ApiOperation({ summary: '微信小程序会员登录' })
  @Post('wxLogin')
  async wxLogin(@Body() data: wxLoginDto) {
    return await this.authService.wxLogin(data);
  }
}
