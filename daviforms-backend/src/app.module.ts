// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'; // Para ConfigModule
import * as Joi from 'joi'; // Para la validación de Joi

// Importa tus módulos

// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { SurveysModule } from './surveys/surveys.module';
import { DatabaseModule } from './database/database.module';
import { SurveysModule } from './surveys/surveys.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SurveyResponsesModule } from './surveys/survey-responses/survey-responses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que ConfigModule esté disponible en toda la aplicación
      validationSchema: Joi.object({ // Opcional pero recomendado para validar .env
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().default('1h'),
        // ... otras variables de entorno
      }),
    }),
    DatabaseModule,
    SurveysModule,
    AuthModule,
    UsersModule,
    SurveyResponsesModule
    // AuthModule,
    // UsersModule,
    // SurveysModule,
    // Agrega otros módulos aquí
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}