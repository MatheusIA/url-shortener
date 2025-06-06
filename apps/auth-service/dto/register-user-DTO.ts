import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'John Doe', description: 'Nome do usuário' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'password123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;
}
