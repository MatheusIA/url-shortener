import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { AuthenticateDTO } from 'apps/auth-service/dto/authenticate-DTO';
import { JwtAuthService } from '../../../../libs/security/jwt.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticateResponseDTO } from 'apps/auth-service/dto/authenticate-response-DTO';

@ApiTags('Auth')
@Controller('authenticate')
export class AuthenticateController {
  constructor(
    private readonly authenticateService: AuthenticateService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Post('/sessions')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autenticar um usuário e gerar um token JWT' })
  @ApiBody({ type: AuthenticateDTO })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  async authenticate(
    @Body() authenticateDTO: AuthenticateDTO,
  ): Promise<AuthenticateResponseDTO> {
    const { user } =
      await this.authenticateService.authenticate(authenticateDTO);

    const token = await this.jwtAuthService.generateToken({
      id: user.id.toString(),
      email: user.email,
    });

    return { token };
  }
}
