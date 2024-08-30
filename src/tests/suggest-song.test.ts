import { AppDataSource } from '../config/data-source';
import { Repository } from 'typeorm';
import { Song } from '../entities/Song.entity';
import { User } from '../entities/User.entity';
import {
  createSuggestSong,
  getAllSuggestSong,
  getSuggestSongById,
  updateSuggestSong,
} from '../services/SuggestSong.service';
import { SuggestedSong } from '../entities/SuggestedSong.entity';
import { SuggestionStatus } from '../enums/SuggestionStatus.enum';

let songRepository: Repository<Song>;
let userRepository: Repository<User>;
let suggestSongRepository: Repository<SuggestedSong>;

beforeAll(async () => {
  await AppDataSource.initialize();
  songRepository = AppDataSource.getRepository(Song);
  userRepository = AppDataSource.getRepository(User);
  suggestSongRepository = AppDataSource.getRepository(SuggestedSong);

  await userRepository.insert([
    {
      username: 'ngocquin',
      dateOfBirth: new Date('2003-02-26'),
      email: 'tran@gmail.com',
    },
    {
      username: 'nhatvy',
      dateOfBirth: new Date('2003-02-20'),
      email: 'vy@gmail.com',
    },
  ]);
});

afterAll(async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryRunner.query('TRUNCATE TABLE `suggested_song`');
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
});

describe('SuggestSongService', () => {
  describe('createSuggestSong', () => {
    it('should create a suggest song and return suggestSong on success', async () => {
      const user = new User({
        username: '147',
        email: '147@gmail.com',
      });
      const songSuggest = new Song({
        title: 'Bài hát gửi đi',
        imageUrl: 'hinhanh.png',
      });

      const result = await createSuggestSong(user, songSuggest);
      expect(result).toBe(result);
    });

    it('should throw an error if there is an issue with creating a suggest song', async () => {
      // Here, you might want to mock or simulate an error in your repository
      jest.spyOn(suggestSongRepository, 'save').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const user = new User();
      user.username = '147';
      user.email = '147@gmail.com';

      const songSuggest = new Song();
      songSuggest.title = 'Bài hát không thể gửi đi';
      songSuggest.imageUrl = 'hinhanh.png';

      const result = await createSuggestSong(user, songSuggest);
      expect(result).toBe(false);
    });
  });

  describe('getAllSuggestSong', () => {
    it('should return all suggested songs with relations', async () => {
      await userRepository.insert([
        {
          username: 'user1',
          email: 'user1@gmail.com',
        },
      ]);
      await songRepository.insert([
        {
          title: 'Bài hát 1',
          imageUrl: 'song1.png',
        },
      ]);

      const user = await userRepository.findOne({
        where: { username: 'user1' },
      });
      const song = await songRepository.findOne({
        where: { title: 'Bài hát 1' },
      });
      if (user) {
        if (song) {
          await suggestSongRepository.insert({
            user,
            song,
          });
        }
        const results = await getAllSuggestSong();

        expect(results.length).toEqual(2);
        expect(results[1].user.username).toBe(user.username);
        expect(results[1].song.title).toBe(song?.title);
      }
    });
  });

  describe('getSuggestSongById', () => {
    it('should return a suggested song by ID with relations', async () => {
      await userRepository.insert([
        {
          username: 'user2',
          email: 'user2@gmail.com',
        },
      ]);

      await songRepository.insert([
        {
          title: 'Bài hát 2',
          imageUrl: 'song2.png',
        },
      ]);

      const user = await userRepository.findOne({
        where: { username: 'user2' },
      });
      const song = await songRepository.findOne({
        where: { title: 'Bài hát 2' },
      });

      if (user && song) {
        const suggestSong = await suggestSongRepository.insert({
          user,
          song,
          status: SuggestionStatus.PENDING,
        });

        const suggestSongId = suggestSong.identifiers[0].id;

        const result = await getSuggestSongById(suggestSongId);

        expect(result).toBeDefined();
        expect(result?.user.username).toBe(user.username);
        expect(result?.song.title).toBe(song.title);
      } else {
        fail('User or Song not found');
      }
    });
  });

  describe('updateSuggestSong', () => {
    it('should update an existing suggested song and return true', async () => {
      await userRepository.insert({
        username: 'user3',
        email: 'user3@example.com',
      });

      await songRepository.insert({
        title: 'Bài hát 3',
        imageUrl: 'song3.png',
      });

      const user = await userRepository.findOne({
        where: { username: 'user3' },
      });
      const song = await songRepository.findOne({
        where: { title: 'Bài hát 3' },
      });

      if (user && song) {
        const suggestSong = await suggestSongRepository.insert({
          user,
          song,
          status: SuggestionStatus.PENDING,
        });

        const suggestSongId = suggestSong.identifiers[0].id;

        const updatedData: Partial<SuggestedSong> = {
          status: SuggestionStatus.APPROVED,
        };

        const result = await updateSuggestSong(suggestSongId, updatedData);

        const updatedSuggestSong = await getSuggestSongById(suggestSongId);

        expect(result).toBe(true);
        expect(updatedSuggestSong?.status).toBe(SuggestionStatus.APPROVED);
      } else {
        fail('User or Song not found');
      }
    });

    it('should return false if the suggested song does not exist', async () => {
      const result = await updateSuggestSong(999, {
        status: SuggestionStatus.APPROVED,
      });

      expect(result).toBe(false);
    });
  });
});
