import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  readonly first_name: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  readonly last_name: string;

  @ApiProperty({ example: 'juan@example.com', description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiPropertyOptional({ example: 30, description: 'Edad' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly age: number;

  @ApiProperty({ example: 'secret123', minLength: 6, description: 'Password' })
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiPropertyOptional({ example: '+541112345678', description: 'Teléfono' })
  @IsString()
  @IsOptional()
  readonly phone: string;
}