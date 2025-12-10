import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
  HttpCode,
  ForbiddenException,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { RemoveProductFromCartDto } from './dto/remove-product-from-cart.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) { }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create() {
    return this.cartsService.create();
  }

  @Get(':cid')
  findOne(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.findOne(cid);
  }

  @Post(':cid/products')
  addProduct(
    @Request() req,
    @Param('cid', ParseMongoIdPipe) cid: string,
    @Body() addProductToCartDto: AddProductToCartDto,
  ) {
    this.authorize(req.user, cid);
    return this.cartsService.addProduct(cid, addProductToCartDto);
  }

  @Delete(':cid/products/:pid')
  removeProduct(
    @Request() req,
    @Param('cid', ParseMongoIdPipe) cid: string,
    @Param('pid', ParseMongoIdPipe) pid: string,
    @Body() removeProductFromCartDto: Omit<RemoveProductFromCartDto, 'productId'>,
  ) {
    this.authorize(req.user, cid);
    const dtoWithProductId = { ...removeProductFromCartDto, productId: pid };
    return this.cartsService.removeProduct(cid, dtoWithProductId);
  }

  @Post(':cid/purchase')
  @HttpCode(200)
  purchase(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.purchase(cid, req.user.email);
  }

  @Delete(':cid')
  clearCart(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.clearCart(cid);
  }

  private authorize(user: any, cartId: string) {
    if (user.role === Role.Admin) {
      return;
    }
    if (user.cartId.toString() !== cartId) {
      throw new ForbiddenException(
        'No tienes permiso para realizar esta acción en este carrito.',
      );
    }
  }
}