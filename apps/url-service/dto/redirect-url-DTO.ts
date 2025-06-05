import { IsString } from 'class-validator';

export class RedirectUrlDTO {
  @IsString()
  shortURL!: string;
}
