import { User, Prisma } from '@prisma/client';

export abstract class UsersRepository {
  abstract createUser(data: Prisma.UserCreateInput): Promise<User>;
  abstract findByEmail(email: string): Promise<User | null>;
}
