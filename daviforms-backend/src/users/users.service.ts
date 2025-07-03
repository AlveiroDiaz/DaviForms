// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt'; // Asegúrate de instalar bcrypt con `npm install bcrypt`
import { RegisterDto } from 'src/auth/dtos/register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(body: RegisterDto): Promise<User> {
        try {
            // Verificar si el usuario ya existe
            const existingUser = await this.userModel.findOne({ email: body.email });
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }

            body.password = await bcrypt.hash(body.password, 10); // Hash la contraseña
            const newUser = new this.userModel(body);
            return newUser.save();
        } catch (error) {
            throw new Error(`Error al registrar el usuario: ${error.message}`);
        }

    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    // Puedes añadir más métodos CRUD aquí si es necesario para la gestión de usuarios
}