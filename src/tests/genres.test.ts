import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import { Genre } from '../entities/Genre.entity';
import * as genreService from '../services/Genre.service';
import { mockTFunction } from '../path/mockTFunction';

describe('GenreService', () => {
  let genreRepository: Repository<Genre>;


  beforeAll(async () => {
    await AppDataSource.initialize();
    genreRepository = AppDataSource.getRepository(Genre);
    await genreRepository.insert([
      { name: 'Rock' },
      { name: 'Pop' },
    ]);
  });

  afterAll(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE `genre`');
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
      await AppDataSource.destroy();
    }
  });

  describe('getGenres', () => {
    it('should return all genres sorted by name ASC', async () => {
      const result = await genreService.getGenres();
      expect(result.length).toEqual(2);
      expect(result[0]).toBeInstanceOf(Genre);
      expect(result[0].name).toEqual('Pop');
    });

    it('should return all genres sorted by name DESC', async () => {
      const result = await genreService.getGenres('name', 'DESC');
      expect(result.length).toEqual(2);
      expect(result[0]).toBeInstanceOf(Genre);
      expect(result[0].name).toEqual('Rock');
    });
  });

  describe('getGenresPage', () => {
    it('should return paginated genres and meta information', async () => {
      const result = await genreService.getGenresPage(1, 1);
      expect(result.genres.length).toEqual(1);
      expect(result.genres[0]).toBeInstanceOf(Genre);
      expect(result.total).toEqual(2);
    });

    it('should return paginated genres matching keyword', async () => {
      const result = await genreService.getGenresPage(1, 10, 'name', 'ASC', 'Rock');
      expect(result.genres.length).toEqual(1);
      expect(result.genres[0]).toBeInstanceOf(Genre);
      expect(result.genres[0].name).toEqual('Rock');
      expect(result.total).toEqual(1);
    });
  });

  describe('getGenreById', () => {
    it('should return Genre if id is valid', async () => {
      const genre = await genreRepository.findOne({
        where: { name: 'Rock' },
      });
      if (genre) {
        const result = await genreService.getGenreById(genre.id);
        expect(result).toBeInstanceOf(Genre);
        if (result instanceof Genre) {
          expect(result.id).toBe(genre.id);
        }
      }
    });

    it('should return null if genre is not found', async () => {
      const result = await genreService.getGenreById(10000);
      expect(result).toBeNull();
    });
  });

  describe('createGenre', () => {
    it('should create and return new genre', async () => {
      const createOptions = {
        name: 'Jazz',
      };
      const result = await genreService.createGenre(createOptions, mockTFunction);
      expect(result).toBeInstanceOf(Genre);
      expect(result.name).toEqual('Jazz');
    });

    it('should throw an error if genre already exists', async () => {
      try {
        await genreService.createGenre({ name: 'Rock' }, mockTFunction);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toBe('error.genreAlreadyExists');
      }
    });

    it('should throw an error if genre creation fails unexpectedly', async () => {
      const createOptions = {
        name: 'Blues',
      };
  
      jest.spyOn(genreRepository, 'save').mockImplementationOnce(() => {
        throw new Error('Some database error');
      });
  
      try {
        await genreService.createGenre(createOptions, mockTFunction);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toBe('error.failedToCreateGenre');
      }
    });
  });

  describe('updateGenre', () => {
    it('should update genre data and return Genre', async () => {
      const genre = await genreRepository.findOne({
        where: { name: 'Jazz' },
      });
      if (genre !== null) {
        const updateOptions = {
          name: 'Jazz & Blues',
        };
        const result = await genreService.updateGenre(genre.id, updateOptions, mockTFunction);
        expect(result).toBeInstanceOf(Genre);
        expect(result.name).toEqual('Jazz & Blues');
      }
    });

    it('should throw an error if genre is not found', async () => {
      try {
        await genreService.updateGenre(10000, { name: 'New Genre' }, mockTFunction);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toBe('error.failedToUpdateGenre');
      }
    });
  });

  describe('deleteGenre', () => {
    it('should delete genre', async () => {
      const genreToDelete = await genreRepository.findOne({
        where: { name: 'Jazz & Blues' },
      });
      if (genreToDelete !== null) {
        await genreService.deleteGenre(genreToDelete.id, mockTFunction);
        const genre = await genreRepository.findOne({
          where: { name: 'Jazz & Blues' },
        });
        expect(genre).toBeNull();
      }
    });

    it('should throw an error if genre is not found', async () => {
      try {
        await genreService.deleteGenre(10000, mockTFunction);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error.message).toBe('error.failedToDeleteGenre');
      }
    });
  });

  describe('searchGenres', () => {
    it('should return genres matching the query', async () => {
      const result = await genreService.searchGenres('Rock');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(Genre);
      expect(result[0].name).toEqual('Rock');
    });
  });
});
