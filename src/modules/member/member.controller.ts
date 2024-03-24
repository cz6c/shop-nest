import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MemberService } from './member.service';
import {
  CreateMemberDto,
  UpdateMemberDto,
  MemberVO,
  MemberListVO,
  MemberListParamsDto,
  RegisterMemberDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { Public } from '@/decorator/public-auth.decorator';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('会员管理')
@ApiBearerAuth()
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() data: CreateMemberDto) {
    return this.memberService.create(data);
  }

  @ApiOperation({ summary: '列表' })
  @ApiOkResponse({ type: MemberListVO })
  @Get('list')
  async findAll(@Query() params: MemberListParamsDto) {
    return await this.memberService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: MemberVO })
  @Get('info')
  async findOne(
    @Query('id') id: string,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.memberService.findOne(id ?? memberId);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(
    @Body() data: UpdateMemberDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.memberService.update(data, data.id ?? memberId);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.memberService.remove(data.id);
  }

  @Public()
  @ApiOperation({ summary: '注册' })
  @Post('register')
  register(@Body() data: RegisterMemberDto) {
    return this.memberService.register(data);
  }
}
