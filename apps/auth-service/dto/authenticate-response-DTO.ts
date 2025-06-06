import { ApiProperty } from '@nestjs/swagger';

export class AuthenticateResponseDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiI...',
    description: 'Token de autenticação JWT',
  })
  token!: string;
}
