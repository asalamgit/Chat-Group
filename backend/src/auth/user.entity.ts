import { Expose } from 'class-transformer';
import { Channel } from 'src/channel/channel.entity';
import { Message } from 'src/channel/message.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  photo: string;

  @Column({ unique: true })
  @Expose()
  name: string;

  @Column()
  @Expose()
  bio: string;

  @Column()
  @Expose()
  phone: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @ManyToMany(() => Channel, (channel) => channel.users)
  channels: Channel[];

  @OneToMany(() => Channel, (channel) => channel.creator)
  createdChannels: Channel[];
}
