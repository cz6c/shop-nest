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
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { Public } from '@/decorator/public-auth.decorator';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('会员管理')
@ApiBearerAuth()
@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Public()
  @ApiOperation({ summary: '创建' })
  @Post('register')
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.memberService.create(createMemberDto);
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
  async findOne(@GetUser('memberId') memberId: string) {
    return await this.memberService.findOne(memberId);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(
    @Body() data: UpdateMemberDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.memberService.update(data, memberId);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.memberService.remove(data.id);
  }
}
