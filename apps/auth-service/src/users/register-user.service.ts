import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../../interfaces/users-repository';
import { CreateUserDTO } from '../../dto/register-user-DTO';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class RegisterUsersService {
  private readonly logger = new Logger(RegisterUsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(createUserDTO: CreateUserDTO): Promise<User> {
    try {
      const { email, name, password } = createUserDTO;

      const password_hash = await hash(password, 6);

      const user = await this.usersRepository.createUser({
        name,
        email,
        password: password_hash,
      });

      return user;
    } catch (error) {
      this.logger.error('Error during user registration: ', error);
      throw error;
    }
  }
}
