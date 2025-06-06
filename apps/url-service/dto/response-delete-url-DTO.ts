import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseDeleteUrlDTO {
  @ApiProperty({
    example: 'URL deletada com sucesso',
    description: 'Mensagem de confirmação da exclusão da URL',
  })
  @IsString()
  message!: string;
}
