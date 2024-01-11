import { IsOptional, IsString, IsDate, IsNotEmpty } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { PaginationDto, PaginationVO, CommonVO } from '@/common/common.dto';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
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
}

export class UserVO extends CommonVO {
  @ApiPropertyOptional({ description: '账号' })
  readonly username: string;

  @ApiPropertyOptional({ description: '昵称' })
  readonly nickname: string;

  @ApiPropertyOptional({ description: '头像' })
  readonly avatar: string;

  @ApiPropertyOptional({ description: '生日' })
  readonly birthday: Date;
}

// 列表
export class UserListVO extends PaginationVO {
  @ApiPropertyOptional({ type: [UserVO], description: '列表' })
  readonly list: UserVO[];
}

// 列表查询
export class UserListParamsDto extends PaginationDto {
  @ApiPropertyOptional({ description: '昵称' })
  @IsOptional()
  @IsString()
  readonly nickname: string;
}

export class UpdateFollowDto {
  @ApiPropertyOptional({ description: '首页背景图' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly homeUrl: string;

  @ApiPropertyOptional({ description: '开始日期' })
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  readonly startDate: Date;
}

export class FollowVo extends CommonVO {
  @ApiPropertyOptional({ description: '首页背景图' })
  readonly homeUrl: string;

  @ApiPropertyOptional({ description: '开始日期' })
  readonly startDate: Date;

  @ApiPropertyOptional({ description: '用户组' })
  readonly users: UserVO[];
}
