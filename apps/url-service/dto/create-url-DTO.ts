import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUrlDTO {
  @IsUrl()
  @IsNotEmpty()
  originalUrl!: string;
}
