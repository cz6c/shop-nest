import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SkuService } from './sku.service';
import {
  UpdateSkuDto,
  SkuVO,
  SkuListVO,
  SkuListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('商品sku管理')
@ApiBearerAuth()
@Controller('sku')
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: SkuListVO })
  @Get('list')
  async findAll(@Query() params: SkuListParamsDto) {
    return await this.skuService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: SkuVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.skuService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateSkuDto) {
    return await this.skuService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.skuService.remove(data.id);
  }
}
