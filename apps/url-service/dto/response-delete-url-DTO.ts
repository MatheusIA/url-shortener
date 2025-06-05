import { IsString } from 'class-validator';

export class ResponseDeleteUrlDTO {
  @IsString()
  message!: string;
}
