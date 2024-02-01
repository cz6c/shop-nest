import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';
import { SpecsEntity } from '@/modules/specs/entities/specs.entity';

// 新增
export class CreateProductDto {
  @ApiProperty({ description: '商品名称' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: '商品编码' })
  @IsString()
  readonly spuCode: string;

  @ApiProperty({ description: '商品分类' })
  @IsUUID()
  readonly categoryId: string;

  @ApiProperty({ description: '商品描述' })
  @IsString()
  readonly desc: string;

  @ApiProperty({ description: '当前价格' })
  @IsNumber()
  readonly price: number;

  @ApiProperty({ description: '商品状态' })
  @IsBoolean()
  readonly status: boolean;

  @ApiProperty({ description: '主图图片集合[ 主图图片链接 ]' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly mainPictures: string[];

  @ApiProperty({ description: '商品详情图片集合[ 图片链接 ]' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly pictures: string[];

  @ApiProperty({ description: 'sku集合[ sku信息 ]' })
  @IsNotEmpty()
  readonly skus: SkuEntity[];

  @ApiProperty({ description: '规格集合[ 规格信息 ]' })
  @IsNotEmpty()
  readonly specs: SpecsEntity[];
}

// 更新
export class UpdateProductDto extends IntersectionType(
  IdDto,
  CreateProductDto,
) {}

// 详情
export class ProductVO extends CommonVO {
  @ApiPropertyOptional({ description: '商品名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: '商品编码' })
  readonly spuCode: string;

  @ApiPropertyOptional({ description: '商品分类' })
  readonly categoryId: string;

  @ApiPropertyOptional({ description: '商品分类' })
  readonly categoryName: string;

  @ApiPropertyOptional({ description: '商品状态' })
  readonly status: boolean;

  @ApiPropertyOptional({ description: '商品描述' })
  readonly desc: string;

  @ApiPropertyOptional({ description: '当前价格' })
  readonly price: number;

  @ApiPropertyOptional({ description: '销量' })
  readonly salesCount: number;

  @ApiPropertyOptional({ description: '主图图片集合[ 主图图片链接 ]' })
  readonly mainPictures: string[];

  @ApiPropertyOptional({ description: '商品详情图片集合[ 图片链接 ]' })
  readonly pictures: string[];

  @ApiPropertyOptional({ description: 'sku集合[ sku信息 ]' })
  readonly skus?: SkuEntity[];

  @ApiPropertyOptional({ description: '规格集合[ 规格信息 ]' })
  readonly specs?: SpecsEntity[];
}

// 分页列表
export class ProductListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [ProductVO], description: '列表' })
  readonly list: ProductVO[];
}

// 列表查询
export class ProductListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '商品名称' })
  @IsOptional()
  @IsString()
  readonly name: string;
}
