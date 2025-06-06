import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RedirectUrlDTO {
  @ApiProperty({
    example: 'https://localhost:3002/A8oSIM',
    description: 'URL encurtada que será redirecionada',
  })
  @IsString()
  shortURL!: string;
}
