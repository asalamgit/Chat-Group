import { useEffect, useRef, useState } from 'react';
import classes from './ModalInterruptor.module.scss';
import { useContext } from 'react';
import { UserContext } from '../../../../contexts/user.context';
import Modal from '../Modal/Modal';

const ModalInterruptor = () => {
	const [modalOpen, setModalOpen] = useState(false);

	const modal = useRef<HTMLDivElement>(null);
	const modalInterruptor = useRef<HTMLButtonElement>(null);
	const setModal = () => setModalOpen((prevState) => !prevState);

	const { currentUser } = useContext(UserContext);

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
		<div className={classes.modalInterruptor}>
			<button onClick={setModal} ref={modalInterruptor}>
				<img src={currentUser ? `http://${process.env.REACT_APP_API_URL}:3000/${currentUser.photo}` : ''} alt="ProfilePhoto" />
				<p>{currentUser && currentUser.name}</p>
				<span className="material-symbols-outlined">{modalOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
			</button>
			<Modal modalOpen={modalOpen} setModalOpen={setModalOpen} modal={modal} name={'modalTop'} />
		</div>
	);
};

export default ModalInterruptor;
