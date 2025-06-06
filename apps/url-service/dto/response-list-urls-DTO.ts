import { IsNumber, IsString } from 'class-validator';

export class ResponseListUrlsDTO {
  @IsNumber()
  id!: number;
  @IsString()
  destination!: string;

  @IsString()
  shortURL!: string;

  @IsNumber()
  clicks!: number;
}
