import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponseDTO {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'johndoe@example.com' })
  email!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;
}
