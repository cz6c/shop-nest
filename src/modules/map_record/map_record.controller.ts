import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MapRecordService } from './map_record.service';
import {
  CreateMapRecordDto,
  UpdateMapRecordDto,
  MapRecordVO,
  MapRecordListVO,
  MapRecordListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('足迹管理')
@ApiBearerAuth()
@Controller('mapRecord')
export class MapRecordController {
  constructor(private readonly map_recordService: MapRecordService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(
    @Body() createUserDto: CreateMapRecordDto,
    @GetUser('followId') followId: number,
  ) {
    return this.map_recordService.create(createUserDto, followId);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: MapRecordListVO })
  @Get('list')
  async findAll(
    @Query() params: MapRecordListParamsDto,
    @GetUser('followId') followId: number,
  ) {
    return await this.map_recordService.findAll(params, followId);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: MapRecordVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.map_recordService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateMapRecordDto) {
    return await this.map_recordService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.map_recordService.remove(data.id);
  }
}
