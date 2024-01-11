import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { MemorialDayService } from './memorial_day.service';
import {
  CreateMemorialDayDto,
  UpdateMemorialDayDto,
  MemorialDayVO,
  MemorialDayListVO,
  MemorialDayListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('纪念日管理')
@ApiBearerAuth()
@Controller('memorialDay')
export class MemorialDayController {
  constructor(private readonly memorial_dayService: MemorialDayService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(
    @Body() createUserDto: CreateMemorialDayDto,
    @GetUser('followId') followId: number,
  ) {
    return this.memorial_dayService.create(createUserDto, followId);
  }

  @ApiOperation({ summary: '列表' })
  @ApiOkResponse({ type: MemorialDayListVO })
  @Get('list')
  async findAll(
    @Query() params: MemorialDayListParamsDto,
    @GetUser('followId') followId: number,
  ) {
    return await this.memorial_dayService.findAll(params, followId);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: MemorialDayVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.memorial_dayService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateMemorialDayDto) {
    return await this.memorial_dayService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.memorial_dayService.remove(data.id);
  }
}
