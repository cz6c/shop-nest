import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { ProductEntity } from '@/modules/product/entities/product.entity';

// 新增
export class CreateSpecificationDto {
  @ApiProperty({ description: '规格名称' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '规格值数组' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly options: string[];

  @ApiProperty({ description: '关联商品' })
  @IsArray()
  readonly products: ProductEntity[];
}

// 更新
export class UpdateSpecificationDto extends IntersectionType(
  IdDto,
  CreateSpecificationDto,
) {}

// 详情
export class SpecificationVO extends CommonVO {
  @ApiPropertyOptional({ description: '规格名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: '规格值数组' })
  readonly options: string[];
}

// 分页列表
export class SpecificationListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [SpecificationVO], description: '列表' })
  readonly list: SpecificationVO[];
}

// 列表查询
export class SpecificationListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '规格名称' })
  @IsOptional()
  @IsString()
  readonly name: string;
}
