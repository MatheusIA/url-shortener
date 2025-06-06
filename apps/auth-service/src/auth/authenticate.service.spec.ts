import {
  describe,
  beforeEach,
  it,
  expect,
  jest,
  afterEach,
} from '@jest/globals';
import { AuthenticateService } from './authenticate.service';
import { UsersRepository } from 'apps/auth-service/interfaces/users-repository';
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('Authenticate Service', () => {
  let service: AuthenticateService;
  let usersRepository: UsersRepository;
  let mockedBcrypt: jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    usersRepository = {
      findByEmail: jest.fn(),
    } as unknown as UsersRepository;

    service = new AuthenticateService(usersRepository);

    mockedBcrypt = jest.mocked(bcrypt, { shallow: true });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should authenticate user with correct credentials', async () => {
    const fakeUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(
      fakeUser as never,
    );
    mockedBcrypt.compare.mockResolvedValue(true as never);

    const result = await service.authenticate({
      email: 'jonhdoe@example.com',
      password: '123456',
    });

    expect(result).toEqual({ user: fakeUser });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(
      'jonhdoe@example.com',
    );
    expect(mockedBcrypt.compare).toHaveBeenCalledWith(
      '123456',
      'hashed-password',
    );
  });

  it('should throw if user does not exist', async () => {
    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(null as never);

    await expect(
      service.authenticate({
        email: 'jonhdoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrowError(new NotFoundException('User with email not found'));
  });

  it('should throw if password is incorrect', async () => {
    const fakeUser = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    (usersRepository.findByEmail as jest.Mock).mockResolvedValue(
      fakeUser as never,
    );
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(
      service.authenticate({
        email: 'jonhdoe@example.com',
        password: '123456',
      }),
    ).rejects.toThrowError(
      new UnauthorizedException('Invalid email or password'),
    );
  });
});
