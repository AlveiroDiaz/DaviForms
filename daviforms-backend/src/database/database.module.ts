// src/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config'; // Para acceder a variables de entorno

@Global() // Hace que este módulo esté disponible globalmente sin necesidad de importarlo en cada módulo que lo use
@Module({
  imports: [
    MongooseModule.forRootAsync({
      // Usamos forRootAsync para poder inyectar ConfigService y obtener la URI de forma asíncrona
      imports: [], // Si necesitas importar algún otro módulo para obtener la configuración (ej. ConfigModule), lo harías aquí
      inject: [ConfigService], // Le decimos a MongooseModule que inyecte ConfigService
      useFactory: async (configService: ConfigService) => ({
        // La factoría asíncrona obtiene la URI de MongoDB de las variables de entorno
        uri: configService.get<string>('MONGO_URI'),
        // Opciones de conexión recomendadas para Mongoose 6+
        // Ya no es necesario useNewUrlParser, useUnifiedTopology, useCreateIndex, useFindAndModify
        // Puedes añadir otras opciones si las necesitas, por ejemplo:
        dbName: configService.get<string>('MONGO_DB'),
        // user: configService.get<string>('MONGO_USER'),
        // pass: configService.get<string>('MONGO_PASSWORD'),
        // authSource: 'admin', // Si tu usuario y contraseña están en una base de datos de autenticación diferente
      }),
    }),
  ],
  controllers: [], // Generalmente, los módulos de base de datos no tienen controladores
  providers: [],   // Generalmente, los módulos de base de datos no tienen proveedores propios más allá de Mongoose
  exports: [MongooseModule], // Exporta MongooseModule para que otros módulos puedan usar .forFeature()
})
export class DatabaseModule {}