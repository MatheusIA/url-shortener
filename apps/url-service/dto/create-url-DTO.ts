import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDTO {
  @ApiProperty({
    example: 'https://example.com',
    description: 'URL original que sera encurtada',
  })
  @IsUrl()
  @IsNotEmpty()
  originalUrl!: string;
}
