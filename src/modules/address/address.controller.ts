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

@ApiTags('地址管理')
@ApiBearerAuth()
@Controller('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(
    @Body() data: CreateAddressDto,
    @GetUser('memberId') memberId: number,
  ) {
    return this.addressService.create(data, memberId);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: AddressListVO })
  @Get('list')
  async findAll(
    @Query() params: AddressListParamsDto,
    @GetUser('memberId') memberId: number,
  ) {
    return await this.addressService.findAll(params, memberId);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: AddressVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.addressService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateAddressDto) {
    return await this.addressService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.addressService.remove(data.id);
  }
}
