import { IsString } from 'class-validator';
export class AuthenticateDTO {
  @IsString()
  email!: string;

  @IsString()
  password!: string;
}
