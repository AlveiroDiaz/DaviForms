// src/auth/dtos/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(30, { message: 'La contraseña no debe exceder los 30 caracteres.' })
  password: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto.' })
  lastName?: string;
}