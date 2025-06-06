import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ResponseUpdateUrlDTO {
  @ApiProperty({
    example: 'URL atualizada com sucesso',
    description: 'Mensagem de confirmação da atualização da URL',
  })
  @IsString()
  message!: string;

  @ApiProperty({
    example: 'https://example.com',
    description: 'Novo endereço da URL original que foi atualizada',
  })
  @IsNotEmpty()
  @IsUrl()
  destination!: string;

  @ApiProperty({
    example: 'https://short.ly/abc123',
    description: 'URL encurtada referente à URL original atualizada',
  })
  @IsUrl()
  urlShortened!: string;
}
