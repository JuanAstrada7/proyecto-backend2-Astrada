import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private readonly twilioClient: Twilio;
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async sendSms(to: string, body: string): Promise<void> {
    const from = this.configService.get<string>('TWILIO_FROM_SMS');
    try {
      const message = await this.twilioClient.messages.create({
        body,
        from,
        to,
      });
      this.logger.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${to}`, error);
    }
  }
}