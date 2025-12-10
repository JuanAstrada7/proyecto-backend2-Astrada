import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsArray,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop Pro', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 1200.5, description: 'Precio del producto' })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({ example: 50, description: 'Cantidad de stock disponible' })
  @IsNumber()
  @Min(0)
  readonly stock: number;

  @ApiProperty({ example: 'A powerful laptop for professionals', required: false })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: 'Laptops', description: 'Categoría del producto' })
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty({ example: 'LP-2025-PRO', description: 'Código único del producto' })
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({ type: [String], required: false, description: 'Lista de URLs de imágenes' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly thumbnails: string[];
}