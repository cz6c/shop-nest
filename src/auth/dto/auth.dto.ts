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
export class UserPayload {
  readonly userId: number; //用户id
  readonly username: string;
  readonly memberId: number; //会员id
}
