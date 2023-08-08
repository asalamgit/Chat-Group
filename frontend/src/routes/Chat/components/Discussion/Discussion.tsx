import React, { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import classes from './Discussion.module.scss';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../../../contexts/user.context';
import Message from './components/Message/Message';
import { IMessage } from '../../../../interfaces/IMessage';
import moment from 'moment';
interface Props {
	socket: Socket | undefined;
	channelId: string;
	messages: IMessage[];
	displayChatLeft: boolean;
	setDisplayChatLeft: Dispatch<SetStateAction<boolean>>;
}

const Discussion = (props: Props) => {
	const [value, setValue] = useState<string>('');

	const messagesContainerRef = useRef<HTMLDivElement | null>(null);

	const { currentUser } = useContext(UserContext);

	const send = (value: string) => {
		if (value.trim() !== '') {
			props.socket?.emit('sendMessage', { room: props.channelId, content: value, userId: currentUser && currentUser.id, channelId: props.channelId });
			setValue('');
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			send(value);
		}
	};

	const areSameDay = (date1: Date, date2: Date) => {
		return moment(date1).isSame(date2, 'day');
	};

	const formatDate = (date: Date) => {
		return moment(date).format('DD/MM/YYYY');
	};

	useEffect(() => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
		}
	}, [props.messages]);

	return (
		<div className={classes.discussion}>
			<div className={classes.channelName}>
				<div className={classes.chatLeftOpen} onClick={() => props.setDisplayChatLeft(true)}>
					<span className="material-symbols-outlined">menu</span>
				</div>
				<p>{props.channelId}</p>
			</div>
			<div className={classes.messages} ref={messagesContainerRef}>
				{props.messages.map((message: IMessage, index: number) => (
					<React.Fragment key={index}>
						{index > 0 && !areSameDay(message.createdAt, props.messages[index - 1].createdAt) && (
							<div className={classes.dateSeparator}>
								<span>{formatDate(message.createdAt)}</span>
							</div>
						)}
						<Message message={message} />
					</React.Fragment>
				))}
			</div>
			<div className={classes.sendMessage}>
				<input placeholder="Type a message here" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyPress}></input>
				<button onClick={() => send(value)}>
					<span className="material-symbols-outlined">send</span>
				</button>
			</div>
		</div>
	);
};

export default Discussion;
