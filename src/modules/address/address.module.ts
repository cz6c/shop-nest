import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { MemberService } from '../member/member.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity]), MemberService],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
