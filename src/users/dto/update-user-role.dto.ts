import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/enums/role.enum';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Role must be either user or admin' })
  readonly role: Role;
}