import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,  // elimina todos los valores que llegan que no tengan un decorador en el dto
      transform: true, // 
      forbidNonWhitelisted: true,  // Entiendo que lanza un error por los atributos que llegan desde el front, que no esten el seteados en el dto o no tienen un decorador 
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
