import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// No permitimos que se actualice el email o la contraseña desde un PUT genérico
export class UpdateUserDto extends PartialType(CreateUserDto) {}