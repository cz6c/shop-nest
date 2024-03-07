import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderVO,
  OrderListVO,
  OrderListParamsDto,
  NowPreDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('admin/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '订单分页列表' })
  @ApiOkResponse({ type: OrderListVO })
  @Get('list')
  async findAll(@Query() params: OrderListParamsDto) {
    return await this.orderService.findAll(params);
  }

  @ApiOperation({ summary: '订单详情' })
  @ApiOkResponse({ type: OrderVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.orderService.findOne(params.id);
  }

  @ApiOperation({ summary: '订单更新' })
  @Post('update')
  async update(@Body() data: UpdateOrderDto) {
    return await this.orderService.update(data);
  }

  @ApiOperation({ summary: '订单删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.orderService.remove(data.id);
  }
}

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('app/order')
export class OrderControllerApp {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '获取购物车结算订单' })
  @Get('pre')
  pre(@GetUser('memberId') memberId: string) {
    return this.orderService.pre(memberId);
  }

  @ApiOperation({ summary: '获取立即购买订单' })
  @Get('nowPre')
  nowPre(@Query() params: NowPreDto) {
    return this.orderService.nowPre(params);
  }

  @ApiOperation({ summary: '订单创建' })
  @Post('create')
  create(@Body() data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @ApiOperation({ summary: '订单分页列表' })
  @ApiOkResponse({ type: OrderListVO })
  @Get('list')
  async findAllByMemberId(
    @Query() params: OrderListParamsDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.orderService.findAllByMemberId(params, memberId);
  }

  @ApiOperation({ summary: '订单详情' })
  @ApiOkResponse({ type: OrderVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.orderService.findOne(params.id);
  }

  @ApiOperation({ summary: '订单更新' })
  @Post('update')
  async update(@Body() data: UpdateOrderDto) {
    return await this.orderService.update(data);
  }

  @ApiOperation({ summary: '订单删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.orderService.remove(data.id);
  }
}
