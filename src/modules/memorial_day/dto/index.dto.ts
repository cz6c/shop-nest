import { IsOptional, IsDate, IsString, IsNotEmpty } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { PaginationDto, PaginationVO, CommonVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

// 新增
export class CreateMemorialDayDto {
  @ApiProperty({ description: '标题' })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: '日期' })
  @IsDate()
  @IsNotEmpty()
  readonly eventDate: Date;
}

// 更新
export class UpdateMemorialDayDto extends IntersectionType(
  IdDto,
  CreateMemorialDayDto,
) {}

// 详情
export class MemorialDayVO extends CommonVO {
  @ApiPropertyOptional({ description: '标题' })
  readonly title: string;

  @ApiPropertyOptional({ description: '日期' })
  readonly eventDate: Date;
}

// 列表
export class MemorialDayListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [MemorialDayVO], description: '列表' })
  readonly list: MemorialDayVO[];
}

// 列表查询
export class MemorialDayListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsOptional()
  @IsString()
  readonly title: string;
}
