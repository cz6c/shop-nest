import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty()
  readonly password: string;
}

// token payload
export class UserDto {
  readonly id: number;
  readonly username: string;
  readonly followId: number;
}
