import { AppDataSource } from '@src/config/data-source';
import { User } from '@src/entities/User.entity';

const userRepository = AppDataSource.getRepository(User);
class UserService {
  public async findByUsername(username: string) {
    return await userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
  public async create(userData: Partial<User>): Promise<boolean> {
    const user = new User(userData);
    return userRepository
      .save(user)
      .then(() => true)
      .catch(() => {
        return false;
      });
  }
  public async findUsers() {
    return await userRepository.find();
  }
  public async findById(id: number) {
    return await userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.comments', 'comment')
      .leftJoinAndSelect('user.favoriteSongs', 'favoriteSong')
      .leftJoinAndSelect('user.suggestedSongs', 'suggestedSong')
      .leftJoinAndSelect('user.playlists', 'playlist')
      .where('user.id = :id', { id: id })
      .addSelect([
        'COUNT(comment.id) as commentCount',
        'COUNT(favoriteSong.id) as favoriteSongCount',
        'COUNT(suggestedSong.id) as suggestedSongCount',
        'COUNT(playlist.id) as playlistCount',
      ])
      .groupBy('user.id')
      .getRawOne();
  }
  public async update(id: number, userData: Partial<User>): Promise<boolean> {
    try {
      const user = await userRepository.findOne({ where: { id } });
      if (!user) {
        return false;
      }
      Object.assign(user, userData);
      await userRepository.save(user);
      return true;
    } catch (error) {
      return false;
    }
  }
  public async delete(id: number) {
    try {
      await userRepository.delete(id);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new UserService();

export const getUserPage = async (
  page: number,
  pageSize: number,
  sortField: keyof User = 'username',
  sortOrder: 'ASC' | 'DESC' = 'ASC'
) => {
  const [users, total] = await userRepository.findAndCount({
    skip: (page - 1) * pageSize,
    take: pageSize,
    order: {
      [sortField]: sortOrder,
    },
  });
  return { users, total };
};
