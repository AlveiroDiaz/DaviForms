// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Añade campos createdAt y updatedAt automáticamente
export class User {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string; // La contraseña se almacenará hasheada

    @Prop({ default: 'user' }) // Puedes tener roles como 'admin', 'user', etc.
    role: string;

    @Prop()
    firstName?: string; // Opcional

    @Prop()
    lastName?: string;  // Opcional
}

export const UserSchema = SchemaFactory.createForClass(User);