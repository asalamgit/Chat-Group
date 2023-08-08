import { IChannel } from './IChannel';
import { IUser } from './IUser';

export interface IMessage {
	content: string;
	channel: IChannel;
	user: IUser;
	createdAt: Date;
}
