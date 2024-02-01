import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpecsService } from './specs.service';
import { IdsDto } from '@/common/common.dto';

@ApiTags('商品规格管理')
@ApiBearerAuth()
@Controller('specs')
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @ApiOperation({ summary: '批量删除' })
  @Post('delete')
  async removes(@Body() data: IdsDto) {
    return await this.specsService.removes(data.ids);
  }
}
