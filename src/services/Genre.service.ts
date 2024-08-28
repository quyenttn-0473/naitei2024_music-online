import { TFunction } from 'i18next';
import { AppDataSource } from '../config/data-source';
import { Genre } from '../entities/Genre.entity';
import { In, Like } from 'typeorm';

const genreRepository = AppDataSource.getRepository(Genre);

export const getGenres = async (
  sortField: keyof Genre = 'name',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  return genreRepository.find({
    order: {
      [sortField]: sortOrder,
    },
  });
};

export const getGenresPage = async (
  page: number,
  pageSize: number,
  sortField: keyof Genre = 'name',
  sortOrder: 'ASC' | 'DESC' = 'ASC',
  query: string = ''
) => {
  const [genres, total] = await genreRepository.findAndCount({
    where: {
      name: Like(`%${query}%`),
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    order: {
      [sortField]: sortOrder,
    },
  });
  return { genres, total };
};

export const getGenreById = async (genreId: number) => {
  return await genreRepository.findOne({
    where: { id: genreId },
    relations: ['songs'],
  });
};

export const getGenresByIds = async (genreIds: number[]): Promise<Genre[]> => {
  return await genreRepository.findBy({
    id: In(genreIds),
  });
};

export const createGenre = async (data: Partial<Genre>, t: TFunction) => {
  try {
    const existingGenre = await genreRepository.findOne({
      where: { name: data.name },
    });

    if (existingGenre) {
      throw new Error(t('error.genreAlreadyExists'));
    }

    const genre = new Genre();
    Object.assign(genre, data);
    await genre.save();
    return genre;
  } catch (error) {
    if(error.message === 'error.genreAlreadyExists' ){
      throw error;
    }
    throw new Error(t('error.failedToCreateGenre'));
  }
};

export const updateGenre = async (
  genreId: number,
  data: Partial<Genre>,
  t: TFunction
) => {
  try {
    const genre = await genreRepository.findOne({ where: { id: genreId } });
    if (!genre) {
      throw new Error(t('error.genreNotFound'));
    }
    Object.assign(genre, data);
    await genre.save();
    return genre;
  } catch (error) {
    throw new Error(t('error.failedToUpdateGenre'));
  }
};

export const deleteGenre = async (genreId: number, t: TFunction) => {
  try {
    const genre = await genreRepository.findOne({ where: { id: genreId } });
    if (!genre) {
      throw new Error(t('error.genreNotFound'));
    }
    await genre.remove();
  } catch (error) {
    throw new Error(t('error.failedToDeleteGenre'));
  }
};

export const searchGenres = async (query: string) => {
  return await genreRepository
    .createQueryBuilder('genre')
    .where('genre.name LIKE :query', { query: `%${query}%` })
    .getMany();
};
