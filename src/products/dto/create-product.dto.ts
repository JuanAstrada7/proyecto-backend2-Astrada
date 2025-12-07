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
  @ApiProperty({ example: 'Laptop Pro', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 1200.5, description: 'The price of the product' })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty({ example: 50, description: 'Available stock quantity' })
  @IsNumber()
  @Min(0)
  readonly stock: number;

  @ApiProperty({ example: 'A powerful laptop for professionals', required: false })
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty({ example: 'Laptops', description: 'Product category' })
  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @ApiProperty({ example: 'LP-2025-PRO', description: 'Unique product code' })
  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty({ type: [String], required: false, description: 'A list of image URLs' })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly thumbnails: string[];
}