import { AppDataSource } from '../config/data-source';
import { Album } from '../entities/Album.entity';
import { getAuthorById } from '../services/Author.service';
import { t } from 'i18next';
import { getSongById } from './Song.service';
import { request, Request } from 'express';

const albumRepository = AppDataSource.getRepository(Album);
export const createAlbum = async (data: {
  title: string;
  imageUrl: string;
  releaseDate: Date;
  authorId?: number;
}) => {
  try {
    const album = new Album();
    album.title = data.title;
    album.imageUrl = data.imageUrl;
    album.releaseDate = data.releaseDate;
    if (data.authorId) {
      const author = await getAuthorById(data.authorId, t);
      if (!author) {
        throw new Error(t('error.authorNotFound'));
      }
      album.author = author;
    }
    await albumRepository.save(album);
    return true;
  } catch (error) {
    return false;
  }
};
export const getAlbums = async () => {
  return albumRepository.find({
    relations: ['author'],
  });
};

export const getAlbumById = async (id: number) => {
  const album = await albumRepository.findOne({
    where: { id },
    relations: ['songs', 'songs.author', 'author'],
  });
  return album;
};

export const updateAlbum = async (id: number, dataAlbum: Partial<Album>) => {
  try {
    const album = await albumRepository.findOne({
      where: { id },
    });
    if (!album) {
      return false;
    }
    Object.assign(album, dataAlbum);
    await album.save();
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteAlbum = async (id: number) => {
  try {
    const album = await albumRepository.findOne({
      where: { id },
    });
    if (!album) {
      return false;
    }
    await albumRepository.remove(album);
    return true;
  } catch (error) {
    return false;
  }
};

export const getAlbumPage = async (
  page: number,
  pageSize: number,
  query: string = ''
) => {
  const skip = (page - 1) * pageSize;
  const qb = albumRepository
    .createQueryBuilder('album')
    .leftJoinAndSelect('album.author', 'author')
    .orderBy('album.releaseDate', 'DESC')
    .skip(skip)
    .take(pageSize);

  if (query) {
    qb.where('album.title LIKE :query', { query: `%${query}%` });
  }

  const [albums, total] = await qb.getManyAndCount();
  return { albums, total };
};

export const addSongToAlbum = async (albumId: number, songId: number) => {
  const album = await getAlbumById(albumId);

  if (!album) {
    return false;
    throw new Error(t('error.albumNotFound'));
  }

  const song = await getSongById(request, songId);
  if (!song) {
    return false;
    throw new Error(t('error.songNotFound'));
  }

  if (!album.songs?.length) {
    album.songs = [];
  }

  album.songs.push(song);
  await album.save();
  return true;
};

export const removeSongFromAlbum = async (albumId: number, songId: number) => {
  const album = await getAlbumById(albumId);

  if (!album) {
    return false;
    throw new Error(t('error.failedToRemoveSongAlbum'));
  }

  if (!album.songs) {
    album.songs = [];
  }
  const songExists = album.songs.some((s) => s.id === songId);
  if (!songExists) {
    return false;
    throw new Error(t('error.songNotFound'));
  }

  album.songs = album.songs.filter((s) => s.id !== songId);
  await album.save();
  return true;
};

export const searchAlbums = async (query: string) => {
  return await albumRepository
    .createQueryBuilder('album')
    .leftJoinAndSelect('album.author', 'author')
    .where('album.title LIKE :query', { query: `%${query}%` })
    .getMany();
};
