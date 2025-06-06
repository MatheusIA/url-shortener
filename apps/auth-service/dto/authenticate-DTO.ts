import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class AuthenticateDTO {
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'E-mail do usuário',
  })
  @IsString()
  email!: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsString()
  password!: string;
}
