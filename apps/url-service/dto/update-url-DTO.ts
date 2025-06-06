import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUrlDTO {
  @ApiProperty({
    example: 'https://example.com',
    description: 'Nova URL de destino',
  })
  @IsNotEmpty()
  @IsUrl()
  destination!: string;
}
