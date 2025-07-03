// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller'; // Si lo tienes, si no, puedes quitarlo por ahora
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController], // Mantén si ya lo generaste, si no, quítalo
  providers: [UsersService],
  exports: [UsersService, MongooseModule], // Exporta UsersService y MongooseModule para que AuthModule pueda usarlos
})
export class UsersModule {}