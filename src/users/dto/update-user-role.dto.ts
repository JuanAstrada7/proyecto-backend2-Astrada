import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: Role, example: Role.User, description: 'Role del usuario' })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'El rol debe ser "user" o "admin"' })
  readonly role: Role;
}