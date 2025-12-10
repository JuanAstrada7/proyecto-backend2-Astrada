import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto (Solo Admin)' })
  @ApiResponse({ status: 201, description: 'El producto se ha creado correctamente.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los productos con paginación' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de elementos por página' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página actual' })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'], description: 'Ordenar por precio' })
  @ApiQuery({ name: 'query', required: false, type: String, description: 'Consulta de filtro en JSON (p. ej., {"category":"Laptops"})' })
  @Get()
  findAll(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('query') query?: string,
  ) {
    return this.productsService.findAll(+limit, +page, sort, query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiResponse({ status: 200, description: 'Devuelve el producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}