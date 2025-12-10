import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'Contraseña actual' })
  @IsString()
  @IsNotEmpty({ message: 'Current password should not be empty' })
  readonly oldPassword: string;

  @ApiProperty({ example: 'newSecret123', minLength: 6, description: 'Nueva contraseña' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  readonly newPassword: string;
}