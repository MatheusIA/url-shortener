import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticateDTO } from 'apps/auth-service/dto/authenticate-DTO';
import { UsersRepository } from 'apps/auth-service/interfaces/users-repository';
import { compare } from 'bcrypt';

@Injectable()
export class AuthenticateService {
  private readonly logger = new Logger(AuthenticateService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async authenticate(authenticateDTO: AuthenticateDTO) {
    const { email, password } = authenticateDTO;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
      throw new NotFoundException('User with email not found');
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!user || !doesPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { user };
  }
}
