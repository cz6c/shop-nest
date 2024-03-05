import { IsBoolean, IsNumber, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

// 新增
export class CreateBannerDto {
  @ApiProperty({ description: '跳转链接' })
  @IsString()
  readonly hrefUrl: string;

  @ApiProperty({ description: '图片链接' })
  @IsString()
  readonly imgUrl: string;

  @ApiProperty({ description: '排序号' })
  @IsNumber()
  readonly sortNum: number;

  @ApiProperty({ description: '状态' })
  @IsBoolean()
  readonly status: boolean;

  @ApiProperty({ description: '备注' })
  @IsString()
  readonly remark: string;
}

// 更新
export class UpdateBannerDto extends IntersectionType(IdDto, CreateBannerDto) {}

// 详情
export class BannerVO extends CommonVO {
  @ApiPropertyOptional({ description: '跳转链接' })
  readonly hrefUrl: string;

  @ApiPropertyOptional({ description: '图片链接' })
  readonly imgUrl: string;

  @ApiPropertyOptional({ description: '排序号' })
  readonly sortNum: number;

  @ApiPropertyOptional({ description: '状态' })
  @IsBoolean()
  readonly status: boolean;

  @ApiPropertyOptional({ description: '备注' })
  @IsString()
  readonly remark: string;
}

// 分页列表
export class BannerListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [BannerVO], description: '列表' })
  readonly list: BannerVO[];
}

// 列表查询
export class BannerListParamsDto extends PaginationDto {}
