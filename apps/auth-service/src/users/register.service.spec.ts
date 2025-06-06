/* eslint-disable @typescript-eslint/unbound-method */
import {
  beforeEach,
  describe,
  jest,
  it,
  expect,
  afterEach,
} from '@jest/globals';
import { RegisterUsersService } from './register-user.service';
import { UsersRepository } from 'apps/auth-service/interfaces/users-repository';
import * as bcrypt from 'bcrypt';
import { UserAlreadyExistsError } from '../_errors/user-already-exists-error';

jest.mock('bcrypt', () => ({
  hash: jest.fn((password: string) => Promise.resolve(`hashed-${password}`)),
  compare: jest.fn((password: string, hashed: string) =>
    Promise.resolve(hashed === `hashed-${password}`),
  ),
}));

describe('Register Service', () => {
  let service: RegisterUsersService;
  let usersRepository: UsersRepository;

  beforeEach(() => {
    usersRepository = {
      createUser: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as UsersRepository;

    service = new RegisterUsersService(usersRepository);
    // mockedBcrypt = jest.mocked(bcrypt, { shallow: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should register a new user', async () => {
    const newUser = {
      id: 1,
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    (usersRepository.createUser as jest.Mock).mockResolvedValue(
      newUser as never,
    );

    await service.execute({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    expect(usersRepository.createUser).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'jonhdoe@example.com',
      password: 'hashed-123456',
    });
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 6);
  });

  it('should not allow registration with existing email', async () => {
    const existingUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(
      existingUser as never,
    );

    await expect(() =>
      service.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(usersRepository.createUser).not.toHaveBeenCalled();
  });

  it('should throw if bcrypt fails', async () => {
    (bcrypt.hash as jest.Mock).mockRejectedValue(
      new Error('Bcrypt error') as never,
    );

    await expect(() =>
      service.execute({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: '123456',
      }),
    ).rejects.toThrow('Bcrypt error');

    expect(usersRepository.createUser).not.toHaveBeenCalled();
  });
});
