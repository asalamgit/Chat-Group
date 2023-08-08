import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import Modal from './components/Modal/Modal';
import classes from './CreateChannel.module.scss';

interface Props {
	socket: Socket | undefined;
}

const CreateChannel = (props: Props) => {
	const [modalOpen, setModalOpen] = useState(false);

	const modal = useRef<HTMLDivElement>(null);
	const modalInterruptor = useRef<HTMLButtonElement>(null);
	const setModal = () => setModalOpen((prevState) => !prevState);

	const handleClickOutside = (event: MouseEvent) => {
		if (modal.current && modalInterruptor.current && !modal.current.contains(event.target as Node) && !modalInterruptor.current.contains(event.target as Node)) {
			setModalOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div className={classes.createChannel}>
			<p>Channels</p>
			<button onClick={setModal} ref={modalInterruptor}>
				<span className="material-symbols-outlined">add</span>
			</button>
			<Modal modalOpen={modalOpen} setModalOpen={setModalOpen} modal={modal} name={'modalTop'} socket={props.socket} />
		</div>
	);
};

export default CreateChannel;
