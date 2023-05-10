import { Controller, Get } from "@nestjs/common";
import { WELCOME_MESSAGE } from "@common/constants/common.constants";

@Controller("/")
export class AppController {
  @Get("")
  default() {
    return WELCOME_MESSAGE;
  }
}
