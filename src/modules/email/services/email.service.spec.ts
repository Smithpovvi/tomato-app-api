import { EmailService } from "./email.service";
import { Test, TestingModule } from "@nestjs/testing";
import { MailerService } from "@nestjs-modules/mailer";
import { createMock } from "@golevelup/ts-jest";

describe("EmailService", () => {
  let emailService: EmailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    })
      .useMocker((token) => {
        if (token === MailerService) {
          return createMock<MailerService>();
        }
      })
      .compile();
    emailService = module.get<EmailService>(EmailService);
  });

  test("Email service should be defined", () => {
    expect(emailService).toBeDefined();
  });
});
