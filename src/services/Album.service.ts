import { AppDataSource } from '@src/config/data-source';
import { Album } from '@src/entities/Album.entity';

const albumRepository = AppDataSource.getRepository(Album);

export const getAlbums = async () => {
  return albumRepository.find({
    relations: ['author'],
  });
};
