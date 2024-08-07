import { IsDateString, IsString } from 'class-validator';

export class EditProfileDto {
  @IsString()
  usernameLogin: string;

  @IsDateString()
  dateOfBirth: Date;
}
