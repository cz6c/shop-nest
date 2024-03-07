import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryVO,
  CategoryListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('商品分类管理')
@ApiBearerAuth()
@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'trees列表' })
  @Get('trees')
  async findTrees() {
    return await this.categoryService.findTrees();
  }

  @ApiOperation({ summary: '通过 parentId 查子列表' })
  @Get('list')
  async findAllChildrenByParentId(@Query() params: CategoryListParamsDto) {
    return await this.categoryService.findAllChildrenByParentId(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: CategoryVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.categoryService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateCategoryDto) {
    return await this.categoryService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.categoryService.remove(data.id);
  }
}

@ApiTags('商品分类管理')
@ApiBearerAuth()
@Controller('app/category')
export class CategoryControllerApp {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'trees列表' })
  @Get('trees')
  async findTrees() {
    return await this.categoryService.findTrees();
  }

  @ApiOperation({ summary: '通过 parentId 查子列表' })
  @Get('list')
  async findAllChildrenByParentId(@Query() params: CategoryListParamsDto) {
    return await this.categoryService.findAllChildrenByParentId(params);
  }
}
