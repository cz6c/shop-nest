import { IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AeraVO {
  @ApiPropertyOptional({ description: '名称' })
  readonly name: string;

  @ApiPropertyOptional({ description: 'code' })
  readonly code: string;

  @ApiPropertyOptional({ description: 'children' })
  readonly children?: AeraVO[];
}

// 列表查询
export class AeraListParamsDto {
  @ApiProperty({ description: 'code' })
  @IsString()
  readonly code: string;

  @ApiProperty({ description: 'level' })
  @IsNumber()
  readonly level: 1 | 2 | 3;
}
