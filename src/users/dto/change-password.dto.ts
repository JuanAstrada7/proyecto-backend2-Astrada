import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Contraseña actual' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual no debe estar vacía' })
  readonly oldPassword: string;

  @ApiProperty({ example: 'newSecret123', minLength: 6, description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La nueva contraseña debe tener al menos 6 caracteres' })
  readonly newPassword: string;
}