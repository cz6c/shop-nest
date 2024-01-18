import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

// 新增
export class CreateSkuDto {
  @ApiProperty({ description: 'sku名称' })
  @IsString()
  readonly skuName: string;

  @ApiProperty({ description: '库存' })
  @IsNumber()
  readonly inventory: number;

  @ApiProperty({ description: '当前价格' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: 'sku图片' })
  @IsString()
  readonly picture: string;

  @ApiProperty({ description: 'sku编码' })
  @IsString()
  readonly skuCode: string;

  @ApiProperty({ description: '规格集合[ 规格信息 ]' })
  @IsString()
  readonly specs: string;
}

// 更新
export class UpdateSkuDto extends IntersectionType(IdDto, CreateSkuDto) {}

// 详情
export class SkuVO extends CommonVO {
  @ApiPropertyOptional({ description: 'sku名称' })
  readonly skuName: string;

  @ApiPropertyOptional({ description: '库存' })
  readonly inventory: number;

  @ApiPropertyOptional({ description: '当前价格' })
  readonly price: number;

  @ApiPropertyOptional({ description: 'sku图片' })
  readonly picture: string;

  @ApiPropertyOptional({ description: 'sku编码' })
  readonly skuCode: string;

  @ApiPropertyOptional({ description: '规格集合[ 规格信息 ]' })
  readonly specs: string;
}

// 分页列表
export class SkuListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [SkuVO], description: '列表' })
  readonly list: SkuVO[];
}

// 列表查询
export class SkuListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'sku名称' })
  @IsOptional()
  @IsString()
  readonly skuName: string;
}
