import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User registered successfully', user };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @Patch(':id/role')
  async updateUserRole(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const updatedUser = await this.usersService.updateRole(id, updateUserRoleDto.role);
    return { message: 'User role updated successfully', user: updatedUser };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(req.user.sub, changePasswordDto);
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post(':id/reset-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset a user password (Admin only)' })
  @HttpCode(HttpStatus.OK)
  async adminResetPassword(@Param('id', ParseMongoIdPipe) id: string) {
    await this.usersService.adminResetPassword(id);
    return { message: `Password for user ${id} has been reset and sent via email.` };
  }
}
