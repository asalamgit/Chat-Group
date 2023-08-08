import { IMessage } from './IMessage';
import { IUser } from './IUser';

export interface IChannel {
	id: number;
	name: string;
	description: string;
	messages: IMessage[];
	users: IUser[];
	creator: IUser;
}
