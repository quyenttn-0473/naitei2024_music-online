import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Column,
  BaseEntity,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';
import { Song } from './Song.entity';
import { SuggestionStatus } from '../enums/SuggestionStatus.enum';

@Entity()
export class SuggestedSong extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.suggestedSongs)
  user: User;

  @OneToOne(() => Song, (song) => song.suggestedSong)
  @JoinColumn()
  song: Song;

  @Column('text', { nullable: true })
  rejection_reason?: string;

  @Column({
    type: 'enum',
    enum: SuggestionStatus,
    default: SuggestionStatus.PENDING,
  })
  status: SuggestionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(data?: Partial<SuggestedSong>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
