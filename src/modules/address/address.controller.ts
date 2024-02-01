import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressVO,
  AddressListVO,
  AddressListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('收货地址管理')
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: '添加收货地址' })
  @Post('create')
  create(
    @Body() data: CreateAddressDto,
    @GetUser('memberId') memberId: string,
  ) {
    return this.addressService.create(data, memberId);
  }

  @ApiOperation({ summary: '收货地址列表' })
  @ApiOkResponse({ type: AddressListVO })
  @Get('list')
  async findAll(
    @Query() params: AddressListParamsDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.addressService.findAll(params, memberId);
  }

  @ApiOperation({ summary: '收货地址详情' })
  @ApiOkResponse({ type: AddressVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.addressService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新收货地址' })
  @Post('update')
  async update(
    @Body() data: UpdateAddressDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.addressService.update(data, memberId);
  }

  @ApiOperation({ summary: '删除收货地址' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.addressService.remove(data.id);
  }

  @ApiOperation({ summary: '设置默认' })
  @Get('setDefault')
  async setDefault(
    @Query() params: IdDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.addressService.setDefault(params.id, memberId);
  }
}
