import { Body, Controller, Logger, Post } from '@nestjs/common';
import { RegisterUsersService } from './register-user.service';
import { CreateUserDTO } from 'apps/auth-service/dto/register-user-DTO';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterUserResponseDTO } from 'apps/auth-service/dto/register-user-response-DTO';
import { RegisterMetricsService } from '../metrics/register-metrics.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(
    private readonly registerUsersService: RegisterUsersService,
    private readonly registerMetricsService: RegisterMetricsService,
  ) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'Usuário registrado com sucesso',
    type: RegisterUserResponseDTO,
  })
  @ApiResponse({ status: 409, description: 'Usuário já existe' })
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<RegisterUserResponseDTO> {
    const { email, name, password } = createUserDTO;

    const user = await this.registerUsersService.execute({
      email,
      name,
      password,
    });

    this.registerMetricsService.incrementRegisterCount();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
