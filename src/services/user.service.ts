import { AppDataSource } from '@src/config/data-source';
import { User } from '@src/entities/User.entity';
class UserService {
  private userRepository = AppDataSource.getRepository(User);

  public async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
  public async create(userData: Partial<User>): Promise<boolean> {
    const user = new User(userData);
    return this.userRepository
      .save(user)
      .then(() => true)
      .catch(() => {
        return false;
      });
  }
  public async findById(id: number) {
    return await this.userRepository
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
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        return false;
      }
      Object.assign(user, userData);
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new UserService();
