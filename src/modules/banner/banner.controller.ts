import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BannerService } from './banner.service';
import {
  CreateBannerDto,
  UpdateBannerDto,
  BannerVO,
  BannerListVO,
  BannerListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('轮播图管理')
@ApiBearerAuth()
@Controller('admin/banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() data: CreateBannerDto) {
    return this.bannerService.create(data);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: BannerListVO })
  @Get('list')
  async findAll(@Query() params: BannerListParamsDto) {
    return await this.bannerService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: BannerVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.bannerService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateBannerDto) {
    return await this.bannerService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.bannerService.remove(data.id);
  }

  @ApiOperation({ summary: '状态切换' })
  @Get('statusCheck')
  async statusCheck(@Query() params: IdDto) {
    return await this.bannerService.statusCheck(params.id);
  }
}
