import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { SentMessageInfo } from "nodemailer";
import { IMailVariables } from "../types/email.types";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  sendActivationCode(address: string, mailVariables: IMailVariables): Promise<SentMessageInfo> {
    if (process.env.NODE_ENV === "test") {
      return Promise.resolve();
    }
    const { subjectMessage, headerMessage, extraMessage, activationCode } = mailVariables;
    return this.mailerService.sendMail({
      to: address,
      from: process.env.EMAIL_USER,
      subject: subjectMessage,
      template: "verification",
      context: {
        headerMessage,
        extraMessage,
        activationCode,
      },
    });
  }
}
