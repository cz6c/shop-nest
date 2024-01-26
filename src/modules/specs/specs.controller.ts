import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpecsService } from './specs.service';
import { UpdateSpecsDto } from './dto/index.dto';

@ApiTags('商品规格管理')
@ApiBearerAuth()
@Controller('specs')
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateSpecsDto) {
    return await this.specsService.update(data);
  }
}
