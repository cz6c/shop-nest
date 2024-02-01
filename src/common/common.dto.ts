import { IsOptional, IsPositive, IsInt, IsUUID } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

/**
 * @description: 列表
 */
export class PaginationDto {
  @ApiPropertyOptional({ description: '页数' })
  @IsOptional()
  @IsPositive()
  @IsInt()
  readonly page: number;

  @ApiPropertyOptional({ description: '页码' })
  @IsOptional()
  @IsPositive()
  @IsInt()
  readonly limit: number;
}

export class PaginationVO {
  @ApiPropertyOptional({ description: '页数' })
  readonly page: number;

  @ApiPropertyOptional({ description: '页码' })
  readonly limit: number;

  @ApiPropertyOptional({ description: '总条数' })
  readonly total: number;
}

/**
 * @description: 公共vo
 */
export class CommonVO {
  @ApiPropertyOptional({ description: 'id' })
  readonly id: string;

  @ApiPropertyOptional({ description: '创建时间' })
  readonly createTime: Date;

  @ApiPropertyOptional({ description: '更新时间' })
  readonly updateTime: Date;
}

/**
 * @description: id
 */
export class IdDto {
  @ApiProperty({ description: 'id' })
  @IsUUID()
  readonly id: string;
}

/**
 * @description: ids
 */
export class IdsDto {
  @ApiProperty({ description: 'ids' })
  @IsUUID('all', { each: true })
  readonly ids: string[];
}
