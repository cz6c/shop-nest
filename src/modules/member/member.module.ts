import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController, MemberControllerApp } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from './entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberEntity])],
  controllers: [MemberController, MemberControllerApp],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
