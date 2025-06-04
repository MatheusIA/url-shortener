import { IsNumber, IsString } from 'class-validator';

export class ResponseListUrlsDTO {
  @IsString()
  destination!: string;

  @IsString()
  shortURL!: string;

  @IsNumber()
  clicks!: number;
}
