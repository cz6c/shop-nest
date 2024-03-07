import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AreaService } from './area.service';
import { AeraListParamsDto } from './dto/index.dto';

@ApiTags('地区管理')
@ApiBearerAuth()
@Controller('api/area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOperation({ summary: '通过 code 查子列表' })
  @Get('list')
  async findAllChildrenByCode(@Query() params: AeraListParamsDto) {
    return await this.areaService.findAllChildrenByCode(params);
  }

  @ApiOperation({ summary: 'trees列表' })
  @Get('trees')
  async findTrees() {
    return await this.areaService.findTrees();
  }
}
