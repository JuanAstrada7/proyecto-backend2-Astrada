import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CartsService } from '../carts/carts.service';
import { EmailService } from '../messaging/email.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly cartsService: CartsService,
    private readonly emailService: EmailService, // Inyectamos el servicio de email
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Crear un carrito nuevo
    const newCart = await this.cartsService.create();
    // 2. Crear el usuario y asignarle el ID del carrito
    const userToCreate = new this.userModel({ ...createUserDto, cart: newCart._id });
    const createdUser = await userToCreate.save();
    // 3. Enviar email de bienvenida (sin esperar a que termine)
    this.emailService.sendUserWelcome(createdUser).catch(console.error);
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Método crucial para el login
  async findByEmail(email: string): Promise<UserDocument | undefined> {
    // Usamos .select('+password') para que nos devuelva la contraseña,
    // que por defecto estaría oculta por el hook toJSON.
    const user = await this.userModel.findOne({ email }).select('+password').exec();
    return user ?? undefined;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return updatedUser;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userModel.findById(userId).select('+password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatching = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid current password');
    }

    user.password = changePasswordDto.newPassword;
    await user.save();
  }

  async adminResetPassword(userId: string): Promise<void> {
    const user: UserDocument = await this.findOne(userId); // Reutilizamos findOne que ya maneja el NotFound

    const newPassword = randomBytes(8).toString('hex'); // Genera una contraseña aleatoria
    user.password = newPassword;
    await user.save();

    // Enviar la nueva contraseña por email (sin esperar)
    this.emailService.sendNewPassword(user, newPassword).catch(console.error);
  }

  async updateRole(userId: string, newRole: Role): Promise<UserDocument> {
    const user = await this.findOne(userId); // Reutiliza findOne para asegurar que el usuario exista
    user.role = newRole;
    await user.save();
    return user;
  }
}
