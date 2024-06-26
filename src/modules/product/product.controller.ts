import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductVO,
  ProductListVO,
  ProductListParamsDto,
} from './dto/index.dto';
import { IdDto, IdsDto } from '@/common/common.dto';

@ApiTags('商品管理')
@ApiBearerAuth()
@Controller('admin/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: ProductListVO })
  @Get('list')
  async findAll(@Query() params: ProductListParamsDto) {
    return await this.productService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: ProductVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.productService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateProductDto) {
    return await this.productService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.productService.remove(data.id);
  }

  @ApiOperation({ summary: '状态切换' })
  @Get('statusCheck')
  async statusCheck(@Query() params: IdDto) {
    return await this.productService.statusCheck(params.id);
  }

  @ApiOperation({ summary: '批量删除规格' })
  @Post('deleteSpecs')
  async removes(@Body() data: IdsDto) {
    return await this.productService.deleteSpecs(data.ids);
  }
}

@ApiTags('商品管理')
@ApiBearerAuth()
@Controller('app/product')
export class ProductControllerApp {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: ProductListVO })
  @Get('list')
  async findAll(@Query() params: ProductListParamsDto) {
    return await this.productService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: ProductVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.productService.findOne(params.id);
  }
}
