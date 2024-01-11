import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '@/decorator/public-auth.decorator';
import { UserDto } from './dto/auth.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiBearerAuth()
@ApiTags('验证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: '登录' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() data: LoginDto, @GetUser() user: UserDto) {
    return await this.authService.login(user);
  }

  @Get('test')
  async test(@GetUser() user: UserDto) {
    return user;
  }
}
