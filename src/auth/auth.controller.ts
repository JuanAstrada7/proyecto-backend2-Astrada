import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Esta ruta ahora es correcta

@Controller('api/sessions') // Coincide con tu ruta de Postman
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // Passport (a través de LocalStrategy) ya validó y adjuntó el usuario a req.user
    const token = await this.authService.login(req.user);
    return { user: req.user, ...token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getProfile(@Request() req) {
    // JwtStrategy ya validó el token y adjuntó el payload a req.user
    return req.user;
  }
}