import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ArticleService } from './article.service';
import {
  CreateArticleDto,
  UpdateArticleDto,
  ArticleVO,
  ArticleListVO,
  ArticleListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { Public } from '@/decorator/public-auth.decorator';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('文章管理')
@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(
    @Body() createArticleDto: CreateArticleDto,
    @GetUser('id') userId: number,
  ) {
    return this.articleService.create(createArticleDto, userId);
  }

  @Public()
  @ApiOperation({ summary: '列表' })
  @ApiOkResponse({ type: ArticleListVO })
  @Get('list')
  async findAll(@Query() params: ArticleListParamsDto) {
    return await this.articleService.findAll(params);
  }

  @Public()
  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: ArticleVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.articleService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateArticleDto) {
    return await this.articleService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.articleService.remove(data.id);
  }
}
