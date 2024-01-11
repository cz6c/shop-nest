import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { PaginationDto, PaginationVO, CommonVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

export class CreateTagDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class UpdateTagDto extends IntersectionType(IdDto, CreateTagDto) {}

export class TagVO extends CommonVO {
  @ApiPropertyOptional({ description: '名称' })
  readonly name: string;
}

// 列表
export class TagListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [TagVO], description: '列表' })
  readonly list: TagVO[];
}

// 列表查询
export class TagListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '名称' })
  @IsOptional()
  @IsString()
  readonly name: string;
}
