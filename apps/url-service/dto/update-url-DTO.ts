import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateUrlDTO {
  @IsNotEmpty()
  @IsUrl()
  destination!: string;
}
