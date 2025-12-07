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

@UseGuards(JwtAuthGuard) // Protegemos todas las rutas del controlador
@Controller('api/carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // Un administrador podría crear un carrito vacío si fuera necesario
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post()
  create() {
    return this.cartsService.create();
  }

  // El usuario obtiene su propio carrito. Un admin podría ver cualquiera.
  @Get(':cid')
  findOne(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.findOne(cid);
  }

  // Añadir un producto al carrito especificado
  @Post(':cid/products')
  addProduct(
    @Request() req,
    @Param('cid', ParseMongoIdPipe) cid: string,
    @Body() addProductToCartDto: AddProductToCartDto,
  ) {
    this.authorize(req.user, cid);
    return this.cartsService.addProduct(cid, addProductToCartDto);
  }

  // Eliminar un producto del carrito especificado
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

  // Finalizar la compra de un carrito específico
  @Post(':cid/purchase')
  @HttpCode(200)
  purchase(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.purchase(cid, req.user.email);
  }

  // Vaciar un carrito específico
  @Delete(':cid')
  clearCart(@Param('cid', ParseMongoIdPipe) cid: string, @Request() req) {
    this.authorize(req.user, cid);
    return this.cartsService.clearCart(cid);
  }

  /**
   * Método privado para centralizar la lógica de autorización.
   * Lanza una excepción si el usuario no es admin y no es el dueño del carrito.
   * @param user El objeto de usuario del request (del payload del JWT)
   * @param cartId El ID del carrito que se intenta acceder/modificar
   */
  private authorize(user: any, cartId: string) {
    if (user.role === Role.Admin) {
      return; // El admin puede continuar
    }
    if (user.cartId.toString() !== cartId) {
      throw new ForbiddenException(
        'You are not allowed to perform this action on this cart.',
      );
    }
  }
}