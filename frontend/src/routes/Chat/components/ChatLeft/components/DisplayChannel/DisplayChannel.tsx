/* eslint-disable react-hooks/exhaustive-deps */
import classes from './DisplayChannel.module.scss';
import { Socket } from 'socket.io-client';
import { useEffect, useState, useContext, Dispatch, SetStateAction } from 'react';
import { UserContext } from '../../../../../../contexts/user.context';
import { IChannel } from '../../../../../../interfaces/IChannel';
import { IMessage } from '../../../../../../interfaces/IMessage';
import { IUser } from '../../../../../../interfaces/IUser';

interface Props {
	setSelectedChannel: Dispatch<SetStateAction<IChannel | null>>;
	socket: Socket | undefined;
	channelId: string;
	setChannelId: Dispatch<SetStateAction<string>>;
	setMessages: Dispatch<SetStateAction<IMessage[]>>;
	init: boolean;
	setInit: Dispatch<SetStateAction<boolean>>;
}

const DisplayChannel = (props: Props) => {
	const [channels, setChannels] = useState<IChannel[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');

	const { currentUser } = useContext(UserContext);

	const changeChannel = (newChannelId: string) => {
		if (props.socket && newChannelId !== props.channelId) {
			props.socket.emit('leaveRoom', props.channelId);
			props.socket.emit('joinRoom', newChannelId);
			props.setChannelId(newChannelId);
			props.setMessages([]);
		}
	};

	const getInitial = (channelName: string) => {
		let tab = channelName.split(' ');
		if (tab.length === 1) return tab[0][0];
		return tab[0][0] + tab[1][0];
	};

	const channelsListener = (newChannel: IChannel) => {
		setChannels((prevChannels) => [...prevChannels, newChannel]);
	};

	const joinChannel = (channelClicked: IChannel) => {
		if (!channelClicked.users.find((user: IUser) => user.name === currentUser?.name)) {
			props.socket?.emit('joinChannel', { userId: currentUser && currentUser.id, channelId: channelClicked.id });
		}
	};

	useEffect(() => {
		props.socket?.on('channelCreated', channelsListener);

		return () => {
			props.socket?.off('channelCreated', channelsListener);
		};
	}, []);

	useEffect(() => {
		props.socket?.emit(
			'getChannels',
			{
				searchQuery: searchValue,
			},
			(channelsReceived: IChannel[]) => {
				setChannels(channelsReceived);
				if (!props.init) {
					// console.log('inint=', init);
					channelsReceived.forEach((channel) => {
						if (channel.name === 'Welcome') {
							changeChannel(channel.name);
							return;
						}
					});
					props.setInit(true);
				}
			}
		);
	}, [searchValue]);

	return (
		<div className={classes.displayChannel}>
			<div className={classes.searchChannel}>
				<span className="material-symbols-outlined">search</span>
				<input placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
			</div>
			<div className={classes.channels}>
				{channels.map((channel: IChannel, index: number) => (
					<div
						key={index}
						className={classes.channel}
						onClick={() => {
							props.setSelectedChannel(channel);
							joinChannel(channel);
							changeChannel(channel.name);
						}}
					>
						<div className={classes.initial}>
							<p>{getInitial(channel.name)}</p>
						</div>
						<p className={classes.channelName}>{channel.name}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default DisplayChannel;
