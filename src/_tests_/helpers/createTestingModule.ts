import { AppModule } from "../../app.module";
import { Test, TestingModule } from "@nestjs/testing";
import { SequalizeTestConfig } from "../configs/sequalizeTest.config";
import { SequelizeConfig } from "../../configs/sequelize.config";

export async function createTestingModule() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(SequelizeConfig)
    .useClass(SequalizeTestConfig)
    .compile();
  const app = moduleRef.createNestApplication();
  return await app.init();
}
