import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendVerificationEmail(to: string, name: string, code: string) {
    
    await this.resend.emails.send({
      
      from: this.configService.get<string>('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev',
      to,
      subject: 'Your verification code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="color:#1d4ed8;">Health CheckUp Dashboard</h2>
          <p>Hi <strong>${name || 'there'}</strong>,</p>
          <p>Use the code below to verify your account. It expires in <strong>10 minutes</strong>.</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;padding:24px 0;color:#1d4ed8;">${code}</div>
          <p style="color:#6b7280;font-size:14px;">If you did not sign up, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendWelcomeEmail(to: string, name: string) {
    await this.resend.emails.send({
      from: this.configService.get<string>('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev',
      to,
      subject: 'Welcome to Health CheckUp Dashboard',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="color:#1d4ed8;">Health CheckUp Dashboard</h2>
          <p>Hi <strong>${name || 'there'}</strong>,</p>
          <p>Your account has been created successfully.</p>
          <p>This is your registered email: <strong>${to}</strong></p>
          <p style="color:#6b7280;font-size:14px;">If you did not sign up, please ignore this email.</p>
        </div>
      `,
    });
  }
}
