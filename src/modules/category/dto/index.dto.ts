import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

export class CreateCategoryDto {
  @ApiProperty({ description: '名称' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'parentId' })
  @IsUUID()
  readonly parentId: string;
}

export class UpdateCategoryDto extends IntersectionType(
  IdDto,
  CreateCategoryDto,
) {}

export class CategoryVO extends CommonVO {
  @ApiPropertyOptional({ description: '名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: 'parentId' })
  readonly parentId: string;

  @ApiPropertyOptional({ description: 'children' })
  readonly children?: CategoryVO[];
}

// 列表查询
export class CategoryListParamsDto {
  @ApiPropertyOptional({ description: 'parentId' })
  @IsOptional()
  @IsUUID()
  readonly parentId: string;
}
