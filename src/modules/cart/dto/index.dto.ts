import { IsBoolean, IsNumber, IsUUID } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
} from '@nestjs/swagger';
import { CommonVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';
import { SkuEntity } from '@/modules/sku/entities/sku.entity';

// 新增
export class CreateCartDto {
  @ApiProperty({ description: '数量' })
  @IsNumber()
  readonly count: number;

  @ApiProperty({ description: 'skuId' })
  @IsUUID()
  readonly skuId: string;
}

export class CartSelectedDto {
  @ApiPropertyOptional({ description: '是否选中' })
  @IsBoolean()
  readonly selected?: boolean;
}

// 更新
export class UpdateCartDto extends IntersectionType(
  IdDto,
  PartialType(CreateCartDto),
  PartialType(CartSelectedDto),
) {}

// 详情
export class CartVO extends CommonVO {
  @ApiPropertyOptional({ description: '数量' })
  readonly count: number;

  @ApiPropertyOptional({ description: '是否选中' })
  readonly selected: boolean;

  @ApiPropertyOptional({ description: 'sku信息' })
  readonly sku: SkuEntity;

  @ApiPropertyOptional({ description: '加入购物车价格' })
  readonly price: number;
}

// 分页列表
export class CartListVO {
  @ApiPropertyOptional({ type: [CartVO], description: '列表' })
  readonly list: CartVO[];
}
