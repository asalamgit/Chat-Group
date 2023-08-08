/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthContext } from '../../contexts/auth.context';
import { IMessage } from '../../interfaces/IMessage';
import { IUser } from '../../interfaces/IUser';
import { getNewAccessToken } from '../../utils/refreshToken';
import classes from './Chat.module.scss';
import ChatLeft from './components/ChatLeft/ChatLeft';
import Discussion from './components/Discussion/Discussion';
import { toast } from 'react-toastify';

const Chat = () => {
	const [socket, setSocket] = useState<Socket>();
	const [socketInitialized, setSocketInitialized] = useState(false);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [members, setMembers] = useState<IUser[]>([]);
	const [channelId, setChannelId] = useState('');
	const [displayChatLeft, setDisplayChatLeft] = useState(false);

	const { accessToken, setAccessToken } = useContext(AuthContext);

	const initSocket = async () => {
		const newAccessToken = await getNewAccessToken(accessToken?.iat);
		if (newAccessToken) {
			setAccessToken(newAccessToken);
			setSocket(
				io(`http://${process.env.REACT_APP_API_URL}:8001`, {
					extraHeaders: {
						Authorization: `Bearer ${newAccessToken && newAccessToken.token}`,
					},
				})
			);
			setSocketInitialized(true);
		} else {
			setSocket(
				io(`http://${process.env.REACT_APP_API_URL}:8001`, {
					extraHeaders: {
						Authorization: `Bearer ${accessToken && accessToken.token}`,
					},
				})
			);
			setSocketInitialized(true);
		}
	};

	useEffect(() => {
		initSocket();
	}, []);

	const messageListener = (message: IMessage) => {
		setMessages((prev) => [...prev, message]);
	};

	const memberListener = (member: IUser) => {
		setMembers((prev) => [...prev, member]);
	};

	const errorListener = (errorMessage: string) => {
		toast.error(errorMessage);
	};

	useEffect(() => {
		socket?.on('message', messageListener);

		socket?.on('member', memberListener);

		socket?.on('error', errorListener);

		socket?.emit('getChannelMessages', channelId, (channelMessages: SetStateAction<IMessage[]>) => {
			setMessages(channelMessages);
		});

		socket?.emit('getChannelMembers', channelId, (channelMembers: SetStateAction<IUser[]>) => {
			setMembers(channelMembers);
		});

		return () => {
			if (socket) {
				socket.off('message', messageListener);
				socket.off('member', memberListener);
				socket.emit('leaveRoom', channelId);
			}
		};
	}, [channelId]);

	return (
		<div className={classes.chat}>
			{socketInitialized && (
				<>
					<ChatLeft socket={socket} channelId={channelId} setChannelId={setChannelId} setMessages={setMessages} members={members} displayChatLeft={displayChatLeft} setDisplayChatLeft={setDisplayChatLeft} />
					<Discussion socket={socket} channelId={channelId} messages={messages} displayChatLeft={displayChatLeft} setDisplayChatLeft={setDisplayChatLeft} />
				</>
			)}
		</div>
	);
};

export default Chat;
