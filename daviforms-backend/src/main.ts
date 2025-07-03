import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades no definidas en los DTOs
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
    transform: true // Transforma payloads a instancias de DTO
  }));
  app.enableCors(); // Habilitar CORS si el frontend y backend están en diferentes dominios
  await app.listen(3000);
}
bootstrap();
