import {
  IsOptional,
  IsString,
  IsDate,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import {
  PaginationDto,
  PaginationVO,
  CommonVO,
  IdDto,
} from '@/common/common.dto';
import { Gender } from '@/common/common.enum';

export class RegisterMemberDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
export class CreateMemberDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  readonly avatar: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  readonly nickname: string;

  @ApiPropertyOptional({ description: '生日' })
  @IsOptional()
  @IsDate()
  readonly birthday: Date;

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiPropertyOptional({ description: '职位' })
  @IsOptional()
  @IsString()
  readonly profession: string;
}

export class UpdateMemberDto extends IntersectionType(
  IdDto,
  OmitType(PartialType(CreateMemberDto), ['username'] as const),
) {}

export class MemberVO extends CommonVO {
  @ApiPropertyOptional({ description: '账号' })
  readonly username: string;

  @ApiPropertyOptional({ description: '昵称' })
  readonly nickname: string;

  @ApiPropertyOptional({ description: '头像' })
  readonly avatar: string;

  @ApiPropertyOptional({ description: '生日' })
  readonly birthday: Date;

  @ApiPropertyOptional({ description: '性别' })
  readonly gender: Gender;

  @ApiPropertyOptional({ description: '职位' })
  readonly profession: string;
}

// 列表
export class MemberListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [MemberVO], description: '列表' })
  readonly list: MemberVO[];
}

// 列表查询
export class MemberListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  readonly nickname: string;
}
