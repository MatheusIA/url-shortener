import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from 'env/env.service';

@Injectable()
export class JwtAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async generateToken(payload: { id: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: payload.id,
        email: payload.email,
      },
      {
        secret: this.envService.get('JWT_SECRET'),
        expiresIn: '1h',
      },
    );
  }

  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.envService.get('JWT_SECRET'),
      });
    } catch (error) {
      return null;
    }
  }
}
