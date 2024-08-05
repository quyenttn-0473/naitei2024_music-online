import { IsDateString, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  title: string;

  @IsDateString()
  releaseDate: Date;

  @IsString()
  authorId: string;
}
