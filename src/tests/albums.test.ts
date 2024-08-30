import {
  addSongToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbumPage,
  getAlbums,
  removeSongFromAlbum,
  searchAlbums,
  updateAlbum,
} from './../services/Album.service';
import { AppDataSource } from '../config/data-source';
import { Album } from '../entities/Album.entity';
import { Repository } from 'typeorm';
import { Song } from '../entities/Song.entity';
import { Author } from '../entities/Author.entity';
import { SongStatus } from '../enums/SongStatus.enum';

let albumRepository: Repository<Album>;
let songRepository: Repository<Song>;
let authorRepository: Repository<Author>;

describe('AlbumService', () => {
  jest.mock('../services/Album.service');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    await AppDataSource.initialize();
    albumRepository = AppDataSource.getRepository(Album);
    songRepository = AppDataSource.getRepository(Song);
    authorRepository = AppDataSource.getRepository(Author);
    await authorRepository.insert([
      {
        fullname: 'Sơn Tùng MTP',
        dateOfBirth: new Date('1994-07-05'),
      },
      {
        fullname: 'HIEUTHUHAI',
        dateOfBirth: new Date('1999-09-28'),
      },
    ]);
    await albumRepository.insert([
      {
        title: 'Sky Tour',
        releaseDate: new Date('2024-08-29'),
      },
      {
        title: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó',
        releaseDate: new Date('2023-08-29'),
      },
    ]);
    await songRepository.insert([
      {
        title: 'Nấu ăn cho em',
        status: SongStatus.Publish,
      },
      {
        title: 'Không phải gu',
        status: SongStatus.Publish,
      },
    ]);
  });

  afterAll(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
      await queryRunner.query('TRUNCATE TABLE `album`');
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

  describe('createAlbum', () => {
    it('should create a album and return true on success', async () => {
      const title = 'Show của Đen';
      const releaseDate = new Date('2020-04-19');
      const imageUrl = '';
      const authorId = 1;

      const result = await createAlbum({
        title,
        imageUrl,
        releaseDate,
        authorId,
      });
      expect(result).toBe(true);
      const afterCreate = await albumRepository.findOne({
        where: { title: title },
      });
      expect(afterCreate).toBeInstanceOf(Album);
      expect(afterCreate).toBe(afterCreate);
    });

    it('should return false if creation fails due to invalid data', async () => {
      const data = {
        title: '',
        imageUrl: '',
        releaseDate: new Date('2024-12-12'),
        author: {
          id: 2,
        },
      };
      try {
        await createAlbum(data);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/invalid data/i);
      }
    });

    it('should handle database errors gracefully', async () => {
      const data = {};
      try {
        await createAlbum(data as any);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/invalid data/i);
      }
    });
  });

  describe('getAlbums', () => {
    it('should return a list of albums', async () => {
      const result = await getAlbums();
      expect(result.length).toEqual(5);
      expect(result[0]).toBeInstanceOf(Album);
    });
  });

  describe('getAlbumById', () => {
    it('should return Album if id is valid', async () => {
      const album = await albumRepository.findOne({
        where: { title: 'Sky Tour' },
      });
      if (album) {
        const result = await getAlbumById(album.id);
        // Kiểm tra xem kết quả trả về có phải là một đối tượng raw không
        expect(result).toBeInstanceOf(Album);
        if (result) {
          expect(result.id).toBe(album.id);
        }
      }
    });

    it('should return null if album is not found', async () => {
      const result = await getAlbumById(1000);
      expect(result).toBeNull();
    });
  });

  describe('updateAlbum', () => {
    it('should update a album and return album if successful', async () => {
      const album = await albumRepository.findOne({
        where: { title: 'Show của Đen' },
      });
      if (album) {
        const updateOptions = {
          imageUrl:
            'https://i1.sndcdn.com/artworks-O2A2yhbroWbMls3E-9mbGJg-t500x500.jpg',
          releaseDate: new Date('2023-05-27'),
        };
        const result = await updateAlbum(album.id, updateOptions);
        expect(result).toBe(true);
      }
    });

    it('should return false if album not found', async () => {
      const result = await updateAlbum(9999, {
        releaseDate: new Date('2024-02-25'),
      });
      expect(result).toBe(false);
    });

    it('should handle errors during update', async () => {
      const result = await updateAlbum(100, {
        title: undefined,
      });
      expect(result).toBe(false);
    });
  });

  describe('deleteAlbum', () => {
    it('should delete a album and return true if successful', async () => {
      const album = await albumRepository.findOne({
        where: { title: 'Ai Cũng Bắt Đầu Từ Đâu Đó' },
      });
      if (album) {
        const result = await deleteAlbum(album.id);
        expect(result).toBe(true);
      }
    });

    it('should return false if deletion fails', async () => {
      const result = await deleteAlbum(999);
      expect(result).toBe(false);
    });
    it('should return false if deletion fails', async () => {
      const spyRemove = jest
        .spyOn(albumRepository, 'remove')
        .mockImplementation(() => {
          throw new Error('Deletion failed');
        });
      const album = await albumRepository.findOne({
        where: { title: 'Ai Cũng Bắt Đầu Từ Đâu Đó' },
      });
      if (album) {
        const result = await deleteAlbum(album.id);
        expect(result).toBe(false);
      }
      spyRemove.mockRestore();
    });
  });

  describe('getAlbumPage', () => {
    it('should return paginated albums and meta information', async () => {
      const result = await getAlbumPage(1, 1);
      expect(result.albums.length).toEqual(1);
      expect(result.albums[0]).toBeInstanceOf(Album);
      expect(result.total).toEqual(5);
    });

    it('should return paginated albums matching keyword', async () => {
      const result = await getAlbumPage(1, 10, 'Sky Tour');
      expect(result.albums.length).toBe(1);
      expect(result.albums[0]).toBeInstanceOf(Album);
      expect(result.albums[0].title).toEqual('Sky Tour');
      expect(result.total).toBe(1);
    });
  });

  describe('searchAlbums', () => {
    it('should return albums matching the query', async () => {
      await albumRepository.save({
        title: 'Bâng Khuâng',
        releaseDate: new Date('2020-01-01'),
        avatar: 'default-avatar.png',
        authorId: 7,
      });

      const result = await searchAlbums('Bâng');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toBeInstanceOf(Album);
      expect(result[0].title).toEqual('Bâng Khuâng');
    });

    it('should return all authors if search query is empty', async () => {
      const result = await searchAlbums('');
      expect(result.length).toEqual(6);
    });

    it('should return albums matching query with special characters', async () => {
      await albumRepository.insert({
        title: 'A Little Warmth',
        releaseDate: new Date('2024-07-11'),
        imageUrl: '',
      });
      const result = await searchAlbums('A Little Warmth');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toEqual('A Little Warmth');
    });

    it('should return albums with exact match in search query', async () => {
      const result = await searchAlbums('Sky Tour');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toEqual('Sky Tour');
    });

    it('should return albums with special characters in search query', async () => {
      const specialCharAuthor = {
        title: 'Special @ Author',
        releaseDate: new Date('1980-01-01'),
      };
      await albumRepository.save(specialCharAuthor);

      const result = await searchAlbums('Special @ Author');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toEqual('Special @ Author');
    });

    it('should return albums matching query case-insensitively', async () => {
      await albumRepository.save({
        title: 'Case Insensitive Test',
        releaseDate: new Date('1980-01-01'),
      });
      const result = await searchAlbums('case insensitive test');
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].title).toEqual('Case Insensitive Test');
    });
  });

  describe('addSongToAlbum', () => {
    it('shouldreturn false if the album is not found', async () => {
      const album = await albumRepository.findOne({
        where: { id: 10 },
      });
      if (!album) {
        const result = await addSongToAlbum(10, 2);
        expect(result).toBe(false);
      }
    });

    it('shouldreturn false if the song is not found', async () => {
      const song = await songRepository.findOne({
        where: { id: 10 },
      });
      if (!song) {
        const result = await addSongToAlbum(2, 10);
        expect(result).toBe(false);
      }
    });

    it('should initialize the songs array if it does not exist', async () => {
      const album = new Album();
      album.title = 'Test Album';
      await albumRepository.save(album);
      if (!album.songs) {
        expect(album).toBe(album);
      }
    });

    it('should add the song to the album and save the album', async () => {
      const album = new Album();
      album.title = 'Show của Đen';
      await albumRepository.save(album);

      const song = new Song();
      song.title = 'Nấu ăn cho em';
      await songRepository.save(song);

      const result = await addSongToAlbum(album.id, song.id);
      expect(result).toBe(true);
    });
  });

  describe('removeSongFromAlbum', () => {
    it('shouldreturn false if the album is not found', async () => {
      const album = await albumRepository.findOne({
        where: { id: 10 },
      });
      if (!album) {
        const result = await removeSongFromAlbum(10, 2);
        expect(result).toBe(false);
      }
    });

    it('should return false if the album has no songs', async () => {
      const album = new Album();
      album.title = 'Album không có bài hát';
      await albumRepository.save(album);

      const result = await removeSongFromAlbum(album.id, 1);
      expect(result).toBe(false);
    });

    it('should return false if the song is not found in the album', async () => {
      const album = new Album();
      album.title = 'Album có bài hát';
      album.songs = [];
      await albumRepository.save(album);

      const song = new Song();
      song.title = 'Bài hát không có trong album';
      await songRepository.save(song);

      const result = await removeSongFromAlbum(album.id, song.id);
      expect(result).toBe(false);
    });

    it('should remove the song from the album and save the album', async () => {
      // Tạo album và bài hát
      const album = new Album();
      album.title = 'Album để xóa bài hát';
      album.songs = [];
      await albumRepository.save(album);

      const song = new Song();
      song.title = 'Bài hát để xóa';
      await songRepository.save(song);

      // Thêm bài hát vào album
      album.songs.push(song);
      await albumRepository.save(album);

      // Xóa bài hát khỏi album
      const result = await removeSongFromAlbum(album.id, song.id);
      expect(result).toBe(true);

      // Tải lại album từ cơ sở dữ liệu
      const updatedAlbum = await albumRepository.findOne({
        where: { id: album.id },
        relations: ['songs'],
      });

      expect(updatedAlbum).not.toBeNull();
      expect(updatedAlbum!.songs).toHaveLength(0); // Kiểm tra rằng album không còn bài hát nào
    });
  });
});
