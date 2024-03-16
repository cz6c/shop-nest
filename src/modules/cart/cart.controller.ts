import { Controller, Get, Post, Body } from '@nestjs/common';
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
  CartListVO,
  CartSelectedDto,
} from './dto/index.dto';
import { IdsDto } from '@/common/common.dto';
import { GetUser } from '@/decorator/getUser.decorator';

@ApiTags('购物车管理')
@ApiBearerAuth()
@Controller('app/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: '加入购物车' })
  @Post('create')
  create(@Body() data: CreateCartDto, @GetUser('memberId') memberId: string) {
    return this.cartService.create(data, memberId);
  }

  @ApiOperation({ summary: '购物车列表' })
  @ApiOkResponse({ type: CartListVO })
  @Get('list')
  async findAll(@GetUser('memberId') memberId: string) {
    return await this.cartService.findAll(memberId);
  }

  @ApiOperation({ summary: '更新购物车单品' })
  @Post('update')
  async update(@Body() data: UpdateCartDto) {
    return await this.cartService.update(data);
  }

  @ApiOperation({ summary: '删除/清空购物车单品' })
  @Post('delete')
  async delete(@Body() data: IdsDto) {
    return await this.cartService.delete(data.ids);
  }

  @ApiOperation({ summary: '购物车全选/取消全选' })
  @Post('selected')
  async selected(
    @Body() data: CartSelectedDto,
    @GetUser('memberId') memberId: string,
  ) {
    return await this.cartService.selected(data.selected, memberId);
  }
}
