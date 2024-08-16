import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  BaseEntity,
} from 'typeorm';
import { Playlist } from './Playlist.entity';
import { Song } from './Song.entity';
import { Comment } from './Comment.entity';
import { SuggestedSong } from './SuggestedSong.entity';
import { UserRoles, UserStatus } from '../enums/UserRoles.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.Guess,
  })
  role: UserRoles;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Playlist, (playlist) => playlist.users)
  @JoinTable()
  playlists: Playlist[];

  @ManyToMany(() => Song, (song) => song.favoritedBy)
  @JoinTable()
  favoriteSongs: Song[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => SuggestedSong, (suggestedSong) => suggestedSong.user)
  suggestedSongs: SuggestedSong[];

  constructor(data?: Partial<User>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
