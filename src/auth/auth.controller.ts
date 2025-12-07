import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/sessions')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.login(req.user);
    return { user: req.user, ...token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getProfile(@Request() req) {
    return req.user;
  }
}