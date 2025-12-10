import { IsJWT, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  @IsNotEmpty()
  readonly token: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly newPassword: string;
}
