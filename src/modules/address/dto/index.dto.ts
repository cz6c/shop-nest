import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { CommonVO, PaginationDto, PaginationVO } from '@/common/common.dto';
import { IdDto } from '@/common/common.dto';

// 新增
export class CreateAddressDto {
  @ApiProperty({ description: '收货人姓名' })
  @IsString()
  @IsNotEmpty()
  readonly receiver: string;

  @ApiProperty({ description: '收货人联系方式' })
  @IsString()
  @IsNotEmpty()
  readonly contact: string;

  @ApiProperty({ description: '省对应的 code' })
  @IsString()
  @IsNotEmpty()
  readonly provinceCode: string;

  @ApiProperty({ description: '市对应的 code' })
  @IsString()
  @IsNotEmpty()
  readonly cityCode: string;

  @ApiProperty({ description: '区/县对应的 code' })
  @IsString()
  @IsNotEmpty()
  readonly countyCode: string;

  @ApiProperty({ description: '收货人详细地址' })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({ description: '是否设置为默认地址' })
  @IsBoolean()
  @IsNotEmpty()
  readonly isDefault: boolean;
}

// 更新
export class UpdateAddressDto extends IntersectionType(
  IdDto,
  CreateAddressDto,
) {}

// 详情
export class AddressVO extends CommonVO {
  @ApiPropertyOptional({ description: '收货人姓名' })
  readonly receiver: string;

  @ApiPropertyOptional({ description: '收货人联系方式' })
  readonly contact: string;

  @ApiPropertyOptional({ description: '省对应的 code' })
  readonly provinceCode: string;

  @ApiPropertyOptional({ description: '市对应的 code' })
  readonly cityCode: string;

  @ApiPropertyOptional({ description: '区/县对应的 code' })
  readonly countyCode: string;

  @ApiPropertyOptional({ description: '收货人详细地址' })
  readonly address: string;

  @ApiPropertyOptional({ description: '是否设置为默认地址' })
  readonly isDefault: boolean;
}

// 分页列表
export class AddressListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [AddressVO], description: '列表' })
  readonly list: AddressVO[];
}

// 列表查询
export class AddressListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '收货人姓名' })
  @IsOptional()
  @IsString()
  readonly receiver: string;
}
