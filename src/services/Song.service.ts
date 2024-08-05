import { AppDataSource } from '../config/data-source';
import { Song } from '../entities/Song.entity';

const songRepository = AppDataSource.getRepository(Song);

export const getSongCountByAlbumId = async (id: number) => {
  return await songRepository.count({
    where: { album: { id } },
  });
};
