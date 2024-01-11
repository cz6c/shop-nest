import {
  IsArray,
  IsDate,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

// 新增
export class CreateMapRecordDto {
  @ApiProperty({ description: '内容' })
  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({ description: '日期' })
  @IsDate()
  @IsNotEmpty()
  readonly eventDate: Date;

  @ApiProperty({ description: '图片数组' })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  readonly files: string[];

  @ApiProperty({ description: '经度' })
  @IsLongitude()
  @IsNotEmpty()
  readonly lng: string;

  @ApiProperty({ description: '纬度' })
  @IsLatitude()
  @IsNotEmpty()
  readonly lat: string;

  @ApiProperty({ description: '地址' })
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}

// 更新
export class UpdateMapRecordDto extends IntersectionType(
  IdDto,
  CreateMapRecordDto,
) {}

// 详情
export class MapRecordVO extends CommonVO {
  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '日期' })
  readonly eventDate: Date;

  @ApiPropertyOptional({ description: '图片数组' })
  readonly files: string[];

  @ApiPropertyOptional({ description: '经度' })
  readonly lng: string;

  @ApiPropertyOptional({ description: '纬度' })
  readonly lat: string;

  @ApiPropertyOptional({ description: '地址' })
  readonly address: string;
}

// 分页列表
export class MapRecordListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [MapRecordVO], description: '列表' })
  readonly list: MapRecordVO[];
}

// 列表查询
export class MapRecordListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '内容' })
  @IsOptional()
  @IsString()
  readonly content: string;
}
