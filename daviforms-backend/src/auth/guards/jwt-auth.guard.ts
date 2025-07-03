// src/auth/guards/jwt-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context) {
    if (err || !user) {
      console.log('❌ Fallo en el JwtAuthGuard', { err, info });
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
