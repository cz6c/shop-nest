import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
} from '@nestjs/swagger';
import { CommonVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { ProductEntity } from '@/modules/product/entities/product.entity';

// 新增
export class CreateSpecsDto {
  @ApiProperty({ description: '规格名称' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '规格值数组' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly options: string[];

  @ApiProperty({ description: '关联商品' })
  @IsNotEmpty()
  readonly product: ProductEntity;
}

// 更新
export class UpdateSpecsDto extends IntersectionType(
  IdDto,
  OmitType(CreateSpecsDto, ['product'] as const),
) {}

// 详情
export class SpecsVO extends CommonVO {
  @ApiPropertyOptional({ description: '规格名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: '规格值数组' })
  readonly options: string[];
}
