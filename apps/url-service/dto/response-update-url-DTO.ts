import { IsNotEmpty, IsUrl } from 'class-validator';

export class ResponseUpdateUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  destination!: string;
}
