import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDocument } from '../users/schemas/user.schema';
import { TicketDocument } from '../tickets/schemas/ticket.schema';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserWelcome(user: UserDocument) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: '¡Bienvenido a nuestro ecommerce!',
      template: './user-registered', // Apunta al archivo .handlebars
      context: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        phone: user.phone,
        role: user.role,
        // Podrías añadir un link al frontend para el login
        // loginLink: 'http://tu-frontend.com/login'
      },
    });
  }

  async sendOrderConfirmation(
    ticket: TicketDocument,
    products: any[],
    notPurchased: any[],
  ) {
    await this.mailerService.sendMail({
      to: ticket.purchaser,
      subject: 'Confirmación de tu pedido',
      template: './order-confirmation',
      context: {
        purchaser: ticket.purchaser,
        code: ticket.code,
        date: ticket.purchase_datetime.toLocaleDateString('es-ES'),
        amount: ticket.amount,
        products: products.map((p) => ({
          ...p.product,
          quantity: p.quantity,
          subtotal: p.product.price * p.quantity,
        })),
        notPurchased,
      },
    });
  }

  async sendPasswordResetLink(user: UserDocument, resetLink: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Restablecimiento de tu contraseña',
      template: './reset-password', // Nueva plantilla
      context: {
        first_name: user.first_name,
        resetLink, // El link generado en AuthService
      },
    });
  }

  async sendNewPassword(user: UserDocument, newPassword: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Tu contraseña ha sido restablecida',
      template: './admin-reset-password',
      context: {
        first_name: user.first_name,
        newPassword,
      },
    });
  }
}
