import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';

// 新增
export class CreateCartDto {
  @ApiProperty({ description: '数量' })
  @IsString()
  @IsNotEmpty()
  readonly count: number;

  @ApiProperty({ description: '是否选中' })
  @IsBoolean()
  @IsNotEmpty()
  readonly selected: boolean;

  @ApiProperty({ description: 'skuId' })
  @IsNumber()
  @IsNotEmpty()
  readonly skuId: number;
}

// 更新
export class UpdateCartDto extends IntersectionType(IdDto, CreateCartDto) {}

// 详情
export class CartVO extends CommonVO {
  @ApiPropertyOptional({ description: '数量' })
  readonly count: number;

  @ApiPropertyOptional({ description: '是否选中' })
  readonly selected: boolean;

  @ApiPropertyOptional({ description: 'skuId' })
  readonly sku: SkuEntity;
}

// 分页列表
export class CartListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [CartVO], description: '列表' })
  readonly list: CartVO[];
}

// 列表查询
export class CartListParamsDto extends PaginationDto {}
