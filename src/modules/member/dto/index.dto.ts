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
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PaginationDto, PaginationVO, CommonVO } from '@/common/common.dto';
import { Gender } from '@/common/common.enum';

export class CreateMemberDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateMemberDto extends OmitType(PartialType(CreateMemberDto), [
  'username',
] as const) {
  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly avatar: string;

  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @ApiPropertyOptional({ description: '生日' })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  readonly birthday: Date;

  @ApiPropertyOptional({ description: '性别' })
  @IsOptional()
  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;

  @ApiPropertyOptional({ description: '职位' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly profession: string;
}

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
