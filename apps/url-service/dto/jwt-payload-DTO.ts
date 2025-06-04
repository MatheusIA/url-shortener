import { IsNumber, IsString } from 'class-validator';

export class JwtPayloadDTO {
  @IsNumber()
  sub!: number;

  @IsString()
  email!: string;
}
