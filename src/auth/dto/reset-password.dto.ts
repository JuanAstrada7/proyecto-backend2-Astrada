import { IsJWT, IsNotEmpty, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  @IsNotEmpty()
  readonly token: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly newPassword: string;
}
