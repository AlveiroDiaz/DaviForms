// src/auth/dtos/login.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  password: string;
}