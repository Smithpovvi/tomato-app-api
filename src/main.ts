import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const PORT: number = Number(process.env.PORT) || 5000;
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(PORT);
    console.log(`Server started on ${PORT} port`);
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
