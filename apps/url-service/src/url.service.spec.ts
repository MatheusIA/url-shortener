/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { UrlService } from './url.service';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UrlRepository } from '../interfaces/url-repository';
import { EnvService } from '../../../env/env.service';
import * as UrlShortenerUtils from '../../../utils/generate-url-shortner';
import { ResponseDeleteUrlDTO } from '../dto/response-delete-url-DTO';

describe('UrlService', () => {
  let service: UrlService;
  let urlRepository: UrlRepository;
  let envService: EnvService;

  beforeEach(() => {
    urlRepository = {
      create: jest.fn(),
      findUrlExists: jest.fn(),
      findByShortURL: jest.fn(),
      incrementClicks: jest.fn(),
      listUrlsByUserId: jest.fn(),
      deleteURL: jest.fn(),
      updateURL: jest.fn(),
    } as unknown as UrlRepository;

    envService = {
      get: jest.fn(),
    } as unknown as EnvService;

    service = new UrlService(urlRepository, envService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createShortenUrl', () => {
    it('should create and return shortened URL', async () => {
      jest.spyOn(envService, 'get').mockReturnValue('http://localhost:3000');
      jest.spyOn(urlRepository, 'findUrlExists').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'create').mockResolvedValue({
        id: 1,
        destination: 'https://example.com',
        shortURL: 'abc123',
        clicks: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        userId: 1,
      } as any);

      jest
        .spyOn(UrlShortenerUtils, 'generateUrlShortener')
        .mockReturnValue('abc123');

      const result = await service.createShortenUrl(
        { originalUrl: 'https://example.com' },
        '1',
      );

      expect(urlRepository.findUrlExists).toHaveBeenCalledWith('abc123');
      expect(urlRepository.create).toHaveBeenCalledWith({
        destination: 'https://example.com',
        shortURL: 'abc123',
        user: { connect: { id: 1 } },
      });
      expect(result.shortURL).toBe('http://localhost:3000/abc123');
    });

    it('should throw InternalServerErrorException on failure', async () => {
      jest
        .spyOn(urlRepository, 'findUrlExists')
        .mockRejectedValue(new Error('fail'));
      await expect(
        service.createShortenUrl({ originalUrl: 'x' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('redirect', () => {
    it('should return destination and increment clicks', async () => {
      jest.spyOn(urlRepository, 'findByShortURL').mockResolvedValue({
        id: 1,
        destination: 'https://example.com',
      } as any);
      jest.spyOn(urlRepository, 'incrementClicks').mockResolvedValue(undefined);

      const result = await service.redirect('abc123');

      expect(result).toBe('https://example.com');
      expect(urlRepository.incrementClicks).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if URL not found', async () => {
      jest.spyOn(urlRepository, 'findByShortURL').mockResolvedValue(null);
      await expect(service.redirect('notfound')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('listMyUrls', () => {
    it('should return formatted URLs', async () => {
      jest.spyOn(urlRepository, 'listUrlsByUserId').mockResolvedValue([
        {
          destination: 'https://example.com',
          shortURL: 'abc123',
          clicks: 5,
        } as any,
      ]);
      jest.spyOn(envService, 'get').mockReturnValue('http://localhost:3000');

      const result = await service.listMyUrls(1);

      expect(result).toEqual([
        {
          destination: 'https://example.com',
          shortURL: 'http://localhost:3000/abc123',
          clicks: 5,
        },
      ]);
    });

    it('should return undefined if no URLs', async () => {
      jest.spyOn(urlRepository, 'listUrlsByUserId').mockResolvedValue(null);
      const result = await service.listMyUrls(1);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteURL', () => {
    it('should delete and return success message', async () => {
      jest
        .spyOn(urlRepository, 'deleteURL')
        .mockResolvedValue({ id: 1 } as any);

      const result = await service.deleteURL(1, 1);

      expect(result).toEqual({ message: 'URL deletada com sucesso !' });
    });

    it('should throw NotFoundException if URL not found', async () => {
      jest
        .spyOn(urlRepository, 'deleteURL')
        .mockResolvedValue(null as unknown as ResponseDeleteUrlDTO);
      await expect(service.deleteURL(1, 1)).rejects.toThrow(
        new NotFoundException(
          'URL informada não encontrada ou usuário sem permissão para essa ação',
        ),
      );
    });
  });

  describe('updateURL', () => {
    it('should update and return success message', async () => {
      jest
        .spyOn(urlRepository, 'updateURL')
        .mockResolvedValue({ destination: 'https://updated.com' } as any);

      const result = await service.updateURL(1, 1, 'https://updated.com');

      expect(result).toEqual({
        message: 'URL atualizada com sucesso !',
        destination: 'https://updated.com',
      });
    });

    it('should throw NotFoundException if URL not found or unauthorized', async () => {
      jest.spyOn(urlRepository, 'updateURL').mockResolvedValue(null);
      await expect(
        service.updateURL(1, 1, 'https://updated.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
