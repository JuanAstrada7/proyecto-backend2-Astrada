import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Si no se especifican roles, se permite el acceso.
    }
    const { user } = context.switchToHttp().getRequest();
    // El objeto 'user' viene del payload del JWT que definimos en jwt.strategy.ts
    // Comprobamos si el rol del usuario está incluido en la lista de roles requeridos.
    return requiredRoles.includes(user.role);
  }
}