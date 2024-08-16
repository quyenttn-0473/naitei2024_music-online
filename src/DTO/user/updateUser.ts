import { IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  username: string;

  @IsString()
  role: string;

  @IsString()
  status: string;
}
