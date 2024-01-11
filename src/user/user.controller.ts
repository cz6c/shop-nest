import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserVO,
  UserListVO,
  UserListParamsDto,
  UpdateFollowDto,
  FollowVo,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { Public } from '@/decorator/public-auth.decorator';
import { UserDto } from '@/auth/dto/auth.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('用户管理')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ApiOperation({ summary: '创建' })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: '列表' })
  @ApiOkResponse({ type: UserListVO })
  @Get('list')
  async findAll(@Query() params: UserListParamsDto) {
    return await this.userService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: UserVO })
  @Get('info')
  async findOne(@GetUser('id') userId: number) {
    return await this.userService.findOne(userId);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateUserDto, @GetUser('id') userId: number) {
    return await this.userService.update(data, userId);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.userService.remove(data.id);
  }

  @ApiOperation({ summary: '绑定关系' })
  @Get('follow')
  async follow(@Query() params: IdDto, @GetUser() user: UserDto) {
    return await this.userService.follow(params.id, user);
  }

  @ApiOperation({ summary: '获取绑定信息' })
  @ApiOkResponse({ type: FollowVo })
  @Get('getFollow')
  async getFollow(@GetUser('followId') followId: number) {
    return await this.userService.getFollow(followId);
  }

  @ApiOperation({ summary: '更新绑定信息' })
  @Post('updateFollow')
  async updateFollow(
    @Body() data: UpdateFollowDto,
    @GetUser('followId') followId: number,
  ) {
    return await this.userService.updateFollow(data, followId);
  }
}
