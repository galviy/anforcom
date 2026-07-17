import nodemailer, { type Transporter } from "nodemailer";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

class EmailService {
  private transporter: Transporter;
  private defaultFrom: string;

  constructor(user: string, pass: string) {
    if (!user || !pass) {
      throw new Error("Email/password tidak boleh kosong");
    }

    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user, pass },
    });

    this.defaultFrom = user;
  }

  async send(options: SendEmailOptions) {
    const { to, subject, html, text, from } = options;

    if (!html && !text) {
      throw new Error("Harus ada 'html' atau 'text' untuk isi email");
    }

    try {
      const info = await this.transporter.sendMail({
        from: from ?? this.defaultFrom,
        to,
        subject,
        html,
        text,
      });

      console.log("Email terkirim:", info.messageId);
      return info;
    } catch (err) {
      console.error("Gagal kirim email:", err);
      throw err;
    }
  }
}

export const email = new EmailService(Bun.env.email_username!, Bun.env.email_password!);