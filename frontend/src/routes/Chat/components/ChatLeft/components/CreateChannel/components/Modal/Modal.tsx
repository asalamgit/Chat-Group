import React, { useContext, useEffect, useState } from 'react';
import classes from './Modal.module.scss';
import { Socket } from 'socket.io-client';
import { UserContext } from '../../../../../../../../contexts/user.context';

interface Props {
	modalOpen: boolean;
	setModalOpen: (arg0: boolean) => void;
	modal: React.RefObject<HTMLDivElement>;
	name: string;
	socket: Socket | undefined;
}

const Modal = (props: Props) => {
	const [channelName, setChannelName] = useState('');
	const [channelDescription, setChannelDescription] = useState('');
	const [disabled, setDisabled] = useState(true);

	const { currentUser } = useContext(UserContext);

	const createChannel = () => {
		props.socket?.emit('createChannel', { channelName: channelName, channelDescription: channelDescription, userId: currentUser?.id });
		setChannelName('');
		setChannelDescription('');
	};

	const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (channelName.length < 15) setChannelName(e.target.value);
	};

	const handleChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (channelDescription.length < 200) setChannelDescription(e.target.value);
	};

	useEffect(() => {
		if (channelName.trim().length >= 2 && channelDescription.trim().length >= 10) {
			setDisabled(false);
		}
	}, [channelName, channelDescription]);

	return (
		<>
			{props.modalOpen && (
				<div className={classes.modal}>
					<div className={classes.modalContent} ref={props.modal}>
						<h5>New channel</h5>
						<input className={classes.channelName} placeholder="Channel name" value={channelName} onChange={handleChangeName} />
						<textarea className={classes.channelDescription} placeholder="Channel description" value={channelDescription} onChange={handleChangeDescription} />
						<button
							disabled={disabled}
							className={classes.modalItem}
							onClick={() => {
								createChannel();
								props.setModalOpen(false);
							}}
						>
							Save
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Modal;
