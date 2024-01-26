import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SpecificationService } from './specification.service';
import {
  CreateSpecificationDto,
  UpdateSpecificationDto,
  SpecificationVO,
  SpecificationListVO,
  SpecificationListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('规格模版管理')
@ApiBearerAuth()
@Controller('specification')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() data: CreateSpecificationDto) {
    return this.specificationService.create(data);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: SpecificationListVO })
  @Get('list')
  async findAll(@Query() params: SpecificationListParamsDto) {
    return await this.specificationService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: SpecificationVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.specificationService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateSpecificationDto) {
    return await this.specificationService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.specificationService.remove(data.id);
  }
}
