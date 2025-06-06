import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ResponseUpdateUrlDTO {
  @ApiProperty({
    example: 'https://example.com',
    description: 'Novo endereço da URL original que foi atualizada',
  })
  @IsNotEmpty()
  @IsUrl()
  destination!: string;
}
