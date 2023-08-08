import { User } from 'src/auth/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Channel } from './channel.entity';

@Entity()
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'text' })
	content: string;

	@ManyToOne(() => Channel, (channel) => channel.messages)
	channel: Channel;

	@ManyToOne(() => User, (user) => user.messages)
	user: User;

	@CreateDateColumn({ type: 'timestamp', nullable: true })
	createdAt: Date;

	@BeforeInsert()
	@BeforeUpdate()
	convertToLocalHours() {
		this.createdAt = new Date(new Date().getTime());
	}
}
