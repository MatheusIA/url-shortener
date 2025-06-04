import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateDTO } from 'apps/auth-service/dto/authenticate-DTO';
import { JwtAuthService } from '../../../../libs/security/jwt.service';

@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly authenticateService: AuthenticateService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post('/sessions')
  @HttpCode(200)
  async authenticate(
    @Body() authenticateDTO: AuthenticateDTO,
  ): Promise<{ token: string }> {
    const { user } =
      await this.authenticateService.authenticate(authenticateDTO);

    const token = await this.jwtAuthService.generateToken({
      id: user.id.toString(),
      email: user.email,
    });

    return { token };
  }
}
