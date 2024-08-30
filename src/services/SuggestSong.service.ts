import { AppDataSource } from '../config/data-source';
import { Song } from '../entities/Song.entity';
import { SuggestedSong } from '../entities/SuggestedSong.entity';
import { User } from '../entities/User.entity';
import { SuggestionStatus } from '../enums/SuggestionStatus.enum';
import { t } from 'i18next';

const suggestSongRepository = AppDataSource.getRepository(SuggestedSong);
export const createSuggestSong = async (
  user: Partial<User>,
  song: Partial<Song>
) => {
  try {
    const suggestedSong = suggestSongRepository.create({
      user,
      song,
      status: SuggestionStatus.PENDING,
    });
    await suggestSongRepository.save(suggestedSong);
    return suggestedSong;
  } catch (error) {
    return false;
    throw new Error(t('error.failedToCreateSuggestSong'));
  }
};

export const getAllSuggestSong = async () => {
  return suggestSongRepository.find({
    relations: ['user', 'song'],
  });
};

export const getSuggestSongById = async (id: number) => {
  return suggestSongRepository.findOne({
    where: { id },
    relations: ['user', 'song'],
  });
};

export const updateSuggestSong = async (
  id: number,
  dataSuggest: Partial<SuggestedSong>
) => {
  try {
    const suggestSong = await getSuggestSongById(id);
    if (!suggestSong) {
      return false;
    }
    Object.assign(suggestSong, dataSuggest);
    await suggestSong.save();
    return true;
  } catch (error) {
    return false;
  }
};
