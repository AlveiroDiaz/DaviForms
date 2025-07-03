import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    // Aquí puedes definir los endpoints relacionados con los usuarios
    // Por ejemplo, puedes tener un endpoint para registrar un nuevo usuario, obtener un usuario por ID, etc.
    // Ejemplo:
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        console.log("Registering user:", registerDto);
        try {
            const user = await this.usersService.create(registerDto);
            return user;
        } catch (error) {
            console.error("Error during registration:", error);
            throw { statusCode: 400, message: error.message || 'Error al registrar el usuario' };
        }
    }
    
    // @Get(':id')
    // async getUserById(@Param('id') id: string) {
    //   return this.usersService.findById(id);
    // }    
}
