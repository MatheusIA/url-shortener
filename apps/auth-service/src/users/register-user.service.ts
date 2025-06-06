import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from '../../interfaces/users-repository';
import { CreateUserDTO } from '../../dto/register-user-DTO';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error';

@Injectable()
export class RegisterUsersService {
  private readonly logger = new Logger(RegisterUsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(createUserDTO: CreateUserDTO): Promise<User> {
    const { email, name, password } = createUserDTO;

    const usersExists = await this.usersRepository.findByEmail(email);
    if (usersExists) {
      this.logger.warn(`User with email ${email} already exists`);
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.createUser({
      name,
      email,
      password: password_hash,
    });

    return user;
  }
}
