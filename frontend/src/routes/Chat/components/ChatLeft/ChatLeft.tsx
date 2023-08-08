import { Dispatch, SetStateAction, useState } from 'react';
import { Socket } from 'socket.io-client';
import { IMessage } from '../../../../interfaces/IMessage';
import { IUser } from '../../../../interfaces/IUser';
import classes from './ChatLeft.module.scss';
import { IChannel } from '../../../../interfaces/IChannel';
import ChannelDetail from './components/ChannelDetail/ChannelDetail';
import CreateChannel from './components/CreateChannel/CreateChannel';
import DisplayChannel from './components/DisplayChannel/DisplayChannel';
import ModalInterruptor from './components/ModalInterruptor/ModalInterruptor';
import clsx from 'clsx';

interface Props {
	socket: Socket | undefined;
	channelId: string;
	setChannelId: Dispatch<SetStateAction<string>>;
	setMessages: Dispatch<SetStateAction<IMessage[]>>;
	members: IUser[];
	displayChatLeft: boolean;
	setDisplayChatLeft: Dispatch<SetStateAction<boolean>>;
}

const ChatLeft = (props: Props) => {
	const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
	const [init, setInit] = useState(false);

	return (
		<div className={clsx(classes.chatLeft, props.displayChatLeft ? classes.showChatLeft : classes.hideChatLeft)}>
			{selectedChannel === null ? (
				<>
					<CreateChannel socket={props.socket} />
					<DisplayChannel setSelectedChannel={setSelectedChannel} socket={props.socket} channelId={props.channelId} setChannelId={props.setChannelId} setMessages={props.setMessages} init={init} setInit={setInit} />
				</>
			) : (
				<ChannelDetail selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} members={props.members} />
			)}
			<ModalInterruptor />
			<div className={classes.chatLeftClose} onClick={() => props.setDisplayChatLeft(false)}>
				<span className="material-symbols-outlined">close</span>
			</div>
		</div>
	);
};

export default ChatLeft;
