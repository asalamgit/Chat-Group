import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Message } from './message.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Message, (message) => message.channel)
  @JoinColumn()
  messages: Message[];

  @ManyToMany(() => User, (user) => user.channels, { cascade: true })
  @JoinTable()
  users: User[];

  @ManyToOne(() => User, (user) => user.createdChannels)
  creator: User;
}
