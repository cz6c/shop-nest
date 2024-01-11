import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TagService } from './tag.service';
import {
  CreateTagDto,
  UpdateTagDto,
  TagVO,
  TagListVO,
  TagListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('文章标签管理')
@ApiBearerAuth()
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @ApiOperation({ summary: '列表' })
  @ApiOkResponse({ type: TagListVO })
  @Get('list')
  async findAll(@Query() params: TagListParamsDto) {
    return await this.tagService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: TagVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.tagService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateTagDto) {
    return await this.tagService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.tagService.remove(data.id);
  }
}
