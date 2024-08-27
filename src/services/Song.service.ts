import { AppDataSource } from '@src/config/data-source';
import { PAGE_SIZE_SONG } from '@src/constants/const';
import { Genre } from '@src/entities/Genre.entity';
import { Song } from '@src/entities/Song.entity';
import { SongStatus } from '@src/enums/SongStatus.enum';
import { UserRoles } from '@src/enums/UserRoles.enum';
import { Request } from 'express';
import { FindOptionsWhere, In, Like, Not } from 'typeorm';

const songRepository = AppDataSource.getRepository(Song);

export const countSongsByGenreId = async (req: Request, genreId: number) => {
  try {
    return await songRepository.count({ where: { genres: { id: genreId } } });
  } catch (error) {
    throw new Error(req.t('error.countSongsByGenre'));
  }
};

export const getAllSongs = async (req: Request, role?: string) => {
  try {
    const whereCondition =
      role === UserRoles.User ? { status: SongStatus.Publish } : {};
    return await songRepository.find({
      where: whereCondition,
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongs'));
  }
};

export const getSongsPage = async (
  page: number,
  pageSize: number = PAGE_SIZE_SONG,
  sortField: keyof Song = 'title',
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  query: string = ''
) => {
  const [songs, total] = await songRepository.findAndCount({
    relations: ['author', 'album', 'genres'],
    where: {
      title: Like(`%${query}%`),
      status: Not(SongStatus.Reject),
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    order: {
      [sortField]: sortOrder,
    },
  });
  return { songs, total };
};

export const getSongById = async (req: Request, songId: number) => {
  try {
    return await songRepository.findOne({
      where: { id: songId },
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongs'));
  }
};

export const getSongsByIds = async (req: Request, songIds: number[]) => {
  try {
    return await songRepository.find({
      where: { id: In(songIds) },
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongs'));
  }
};

export const getSongsByGenreId = async (req: Request, genreId: number) => {
  try {
    return await songRepository.find({
      where: { genres: { id: genreId } },
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongs'));
  }
};

export const getSongsByAuthorId = async (
  req: Request,
  authorId: number,
  role?: string
) => {
  try {
    const whereCondition: FindOptionsWhere<Song> = { author: { id: authorId } };

    if (role === UserRoles.User) {
      whereCondition.status = SongStatus.Publish;
    }

    return await songRepository.find({
      where: whereCondition,
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongs'));
  }
};

export const countSongsByAuthorId = async (req: Request, authorId: number) => {
  try {
    return await songRepository.count({ where: { author: { id: authorId } } });
  } catch (error) {
    throw new Error(req.t('error.countSongsByGenre'));
  }
};

export const createSong = async (req: Request, data: Partial<Song>) => {
  try {
    const song = new Song(data);
    await song.save();
    return song;
  } catch (error) {
    throw new Error(req.t('error.failedToCreateSong'));
  }
};

export const updateSong = async (
  req: Request,
  songId: number,
  data: Partial<Song>
) => {
  try {
    const song = await songRepository.findOne({ where: { id: songId } });
    if (!song) {
      throw new Error(req.t('error.songNotFound'));
    }
    Object.assign(song, data);
    await song.save();
    return song;
  } catch (error) {
    throw new Error(req.t('error.failedToUpdateSong'));
  }
};

export const updateSongGenres = async (
  req: Request,
  songId: number,
  genres: Genre[]
) => {
  const song = await Song.findOne({
    where: { id: songId },
    relations: ['genres'],
  });
  if (!song) {
    throw new Error(req.t('error.songNotFound'));
  }
  song.genres = genres;
  await song.save();
};

export const deleteSong = async (
  req: Request,
  songId: number,
  reason: string
) => {
  try {
    const song = await songRepository.findOne({ where: { id: songId } });
    if (!song) {
      throw new Error(req.t('error.songNotFound'));
    }

    song.status = SongStatus.Deleted;
    song.deleteReason = reason;
    await song.save();
  } catch (error) {
    throw new Error(req.t('error.failedToDeleteSong'));
  }
};

export const songsSortByUpdatedAt = async (req: Request) => {
  try {
    const songs = await songRepository.find();
    const sortedSongs = songs.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return sortedSongs;
  } catch (error) {
    throw new Error(req.t('error.sortSongsByUpdatedAt'));
  }
};
export const songsSortByUpdatedAtWithStatus = async (
  req: Request,
  status: SongStatus
) => {
  try {
    const songs = await songRepository.find({
      where: {
        status: status,
      },
      relations: ['author'],
    });
    const sortedSongs = songs.sort((a, b) => {
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return sortedSongs;
  } catch (error) {
    throw new Error(req.t('error.sortSongsByUpdatedAt'));
  }
};
export const getSongCountByAlbumId = async (id: number) => {
  return await songRepository.count({
    where: { album: { id } },
  });
};

export const searchSongs = async (query: string, role?: string) => {
  let songQuery = songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.author', 'author')
    .where('(song.title LIKE :query OR author.fullname LIKE :query)', {
      query: `%${query}%`,
    });

  if (role === UserRoles.User || role === UserRoles.Guess) {
    songQuery = songQuery.andWhere('song.status != :status', {
      status: SongStatus.Deleted,
    });
  }

  return await songQuery.getMany();
};

export const getSongsBySameAuthor = async (
  req: Request,
  authorId: number,
  excludeSongId: number,
  role?: string
) => {
  const whereCondition: any = {
    author: { id: authorId },
    id: Not(excludeSongId),
  };

  if (role === UserRoles.User) {
    whereCondition.status = Not(SongStatus.Deleted);
  }

  try {
    return await songRepository.find({
      where: whereCondition,
      relations: ['author', 'album', 'genres'],
    });
  } catch (error) {
    throw new Error(req.t('error.failedToFetchSongsBySameAuthor'));
  }
};

export const getSongsByPlaylistId = async (playlistId: number) => {
  return await songRepository
    .createQueryBuilder('song')
    .leftJoinAndSelect('song.playlists', 'playlist')
    .leftJoinAndSelect('song.author', 'author')
    .where('playlist.id = :playlistId', { playlistId })
    .getMany();
};
