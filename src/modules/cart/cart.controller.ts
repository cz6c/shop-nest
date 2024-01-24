import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import {
  CreateCartDto,
  UpdateCartDto,
  CartVO,
  CartListVO,
  CartListParamsDto,
} from './dto/index.dto';
import { IdDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('购物车管理')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: '创建' })
  @Post('create')
  create(@Body() data: CreateCartDto, @GetUser('memberId') memberId: number) {
    return this.cartService.create(data, memberId);
  }

  @ApiOperation({ summary: '分页列表' })
  @ApiOkResponse({ type: CartListVO })
  @Get('list')
  async findAll(
    @Query() params: CartListParamsDto,
    @GetUser('memberId') memberId: number,
  ) {
    return await this.cartService.findAll(params, memberId);
  }

  @ApiOperation({ summary: '详情' })
  @ApiOkResponse({ type: CartVO })
  @Get('info')
  async findOne(@Query() params: IdDto) {
    return await this.cartService.findOne(params.id);
  }

  @ApiOperation({ summary: '更新' })
  @Post('update')
  async update(@Body() data: UpdateCartDto) {
    return await this.cartService.update(data);
  }

  @ApiOperation({ summary: '删除' })
  @Post('delete')
  async remove(@Body() data: IdDto) {
    return await this.cartService.remove(data.id);
  }
}
