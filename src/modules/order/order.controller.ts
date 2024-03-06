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
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';

@ApiTags('订单管理')
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: '购物车结算' })
  @Post('pre')
  pre(@Body() data: CreateOrderDto) {
    return this.orderService.pre(data);
  }

  @ApiOperation({ summary: '立即购买' })
  @Post('nowPre')
  nowPre(@Body() data: CreateOrderDto) {
    return this.orderService.nowPre(data);
  }

  @ApiOperation({ summary: '创建订单' })
  @Post('create')
  create(@Body() data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: OrderListVO })
  @Get('list')
  async findAll(@Query() params: OrderListParamsDto) {
    return await this.orderService.findAll(params);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: OrderVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.orderService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateOrderDto) {
    return await this.orderService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.orderService.remove(data.id);
  }
}
