import UserService from '../services/user.service';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User.entity';
import { Repository } from 'typeorm';
import { getUserPage } from '../services/user.service';

let userRepository: Repository<User>;
beforeAll(async () => {
  await AppDataSource.initialize();
  userRepository = AppDataSource.getRepository(User);
  await userRepository.insert([
    { username: 'ngocquin' },
    { username: 'nhatvy' },
  ]);
});

afterAll(async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0 ');
    await queryRunner.query('TRUNCATE TABLE `user`');
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
});
describe('UserService', () => {
  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      const user = await userRepository.findOne({
        where: {
          username: 'ngocquin',
        },
      });
      if (user) {
        const result = await UserService.findByUsername(user.username);
        expect(result).toBeInstanceOf(User);
        if (result instanceof User) {
          expect(result.username).toBe(user.username);
        }
      }
    });

    it('should return null if user is not found', async () => {
      const result = await UserService.findByUsername('linhtinh');
      expect(result).toBeNull();
    });

    it('should handle error when findByUsername throws', async () => {
      try {
        await UserService.findByUsername('erroruser');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Error');
      }
    });
  });

  describe('create', () => {
    it('should create a user and return true on success', async () => {
      const newUserData = { username: 'newuser', password: 'password' };
      const result = await UserService.create(newUserData);
      expect(result).toBe(true);
      const createdUser = await userRepository.findOne({
        where: { username: newUserData.username },
      });
      expect(createdUser).toBeInstanceOf(User);
      expect(createdUser?.username).toBe(newUserData.username);
    });

    it('should return false if creation fails due to invalid data', async () => {
      const invalidUserData = { username: '' }; // Dữ liệu không hợp lệ
      try {
        await UserService.create(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/invalid data/i);
      }
    });

    it('should handle database errors gracefully', async () => {
      const invalidUserData = {}; // Dữ liệu không hợp lệ
      try {
        await UserService.create(invalidUserData);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/invalid data/i);
      }
    });
  });

  describe('findUsers', () => {
    it('should return a list of users', async () => {
      const result = await UserService.findUsers();
      expect(result.length).toEqual(10);
      expect(result[0]).toBeInstanceOf(User);
    });
  });

  describe('findById', () => {
    it('should return User if id is valid', async () => {
      const user = await userRepository.findOne({
        where: { username: 'ngocquin' },
      });
      if (user) {
        const result = await UserService.findById(user.id);
        // Kiểm tra xem kết quả trả về có phải là một đối tượng raw không
        expect(result).toHaveProperty('user_id');
        expect(result).toHaveProperty('user_username');
        expect(result).toHaveProperty('commentCount');
        expect(result).toHaveProperty('favoriteSongCount');
        expect(result).toHaveProperty('suggestedSongCount');
        expect(result).toHaveProperty('playlistCount');
        expect(result.user_id).toBe(user.id);
        expect(result.user_username).toBe(user.username);
      }
    });

    it('should return null if user is not found', async () => {
      const result = await UserService.findById(2000);
      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update a user and return user if successful', async () => {
      const user = await userRepository.findOne({
        where: { username: 'ngocquin' },
      });
      if (user) {
        const updateOptions = {
          email: 'tran@gmail.com',
          dateOfBirth: new Date('2003-02-26'),
        };
        const result = await UserService.update(user.id, updateOptions);
        expect(result).toBeInstanceOf(User);
        expect(result).toBe(result);
      }
    });

    it('should return false if user not found', async () => {
      const result = await UserService.update(9999, {
        dateOfBirth: new Date('2024-02-25'),
      });

      expect(result).toBe(false);
    });

    it('should handle errors during update', async () => {
      const result = await UserService.update(100, {
        email: undefined, // Giả sử cập nhật với giá trị không hợp lệ
      });

      expect(result).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete a user and return true if successful', async () => {
      const user = await userRepository.findOne({
        where: { username: 'ngocquin' },
      });
      if (user) {
        const result = await UserService.delete(user.id);
        expect(result).toBe(true);
      }
    });

    it('should return false if deletion fails', async () => {
      const result = await UserService.delete(999);
      expect(result).toBe(false);
    });

    it('should handle errors during delete', async () => {
      // Giả sử có lỗi xảy ra khi xóa
      jest
        .spyOn(userRepository, 'delete')
        .mockRejectedValue(new Error('Delete Error'));
      const result = await UserService.delete(1);
      expect(result).toBe(false);
    });
  });

  describe('getUserPage', () => {
    it('should return paginated users and meta information', async () => {
      const result = await getUserPage(1, 1);
      expect(result.users.length).toEqual(1);
      expect(result.users[0]).toBeInstanceOf(User);
      expect(result.total).toEqual(9);
    });

    it('should return paginated users matching keyword', async () => {
      const result = await getUserPage(1, 10, 'username', 'ASC', 'nhatvy');
      expect(result.users.length).toBe(2);
      expect(result.users[0]).toBeInstanceOf(User);
      expect(result.users[0].username).toEqual('nhatvy');
      expect(result.total).toBe(2);
    });
  });
});
