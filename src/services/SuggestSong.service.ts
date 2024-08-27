import { AppDataSource } from '@src/config/data-source';
import { Song } from '@src/entities/Song.entity';
import { SuggestedSong } from '@src/entities/SuggestedSong.entity';
import { User } from '@src/entities/User.entity';
import { SuggestionStatus } from '@src/enums/SuggestionStatus.enum';
import { t } from 'i18next';

const suggestSongRepository = AppDataSource.getRepository(SuggestedSong);
export const createSuggestSong = async (
  user: Partial<User>,
  song: Partial<Song>
): Promise<SuggestedSong> => {
  try {
    const suggestedSong = suggestSongRepository.create({
      user,
      song,
      status: SuggestionStatus.PENDING,
    });
    await suggestSongRepository.save(suggestedSong);
    return suggestedSong;
  } catch (error) {
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
