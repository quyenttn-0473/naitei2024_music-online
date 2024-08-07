import { AppDataSource } from '@src/config/data-source';
import { Song } from '@src/entities/Song.entity';
import { TFunction } from 'i18next';

const songRepository = AppDataSource.getRepository(Song);

export const countSongsByGenreId = async (genreId: number, t: TFunction) => {
  try {
    return await songRepository.count({ where: { genres: { id: genreId } } });
  } catch (error) {
    throw new Error(t('error.countSongsByGenre'));
  }
};
