import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

// token payload
export class UserPayload {
  readonly userId: number; //用户id
  readonly username: string;
  readonly memberId: number; //会员id
}

// 微信小程序登录
export class wxLoginDto {
  @ApiProperty({ description: 'code 通过 wx.login() 获取' })
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({ description: '通过 getphonenumber 事件回调中获取' })
  @IsString()
  @IsNotEmpty()
  readonly encryptedData: string;

  @ApiProperty({ description: '通过 getphonenumber 事件回调中获取' })
  @IsString()
  @IsNotEmpty()
  readonly iv: string;
}
