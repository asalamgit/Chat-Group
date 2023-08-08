import classes from './Modal.module.scss';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../../../contexts/user.context';
import { AuthContext } from '../../../../contexts/auth.context';
import { getNewAccessToken } from '../../../../utils/refreshToken';
import clsx from 'clsx';
import api from '../../../../utils/api';

interface Props {
	modalOpen: boolean;
	setModalOpen: (arg0: boolean) => void;
	modal: React.RefObject<HTMLDivElement>;
	name: string;
}

const Modal = (props: Props) => {
	const { setCurrentUser } = useContext(UserContext);
	const { accessToken, setAccessToken } = useContext(AuthContext);

	const navigate = useNavigate();

	const logout = async () => {
		const newAccessToken = await getNewAccessToken(accessToken?.iat);
		if (newAccessToken) {
			setAccessToken(newAccessToken);
		}
		api
			.post(
				`/auth/logout`,
				{},
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${newAccessToken ? newAccessToken.token : accessToken && accessToken.token}`,
					},
					withCredentials: true,
				}
			)
			.then(() => {
				setCurrentUser(null);
				setAccessToken(null);
				navigate('/signin');
			})
			.catch((error) => {
				console.error(error.response?.data.message);
			});
	};

	return (
		<>
			{props.modalOpen && (
				<div className={clsx(classes.modal, props.name === 'modalTop' ? classes.modalTop : classes.modalBottom)} ref={props.modal}>
					<div
						className={classes.modalItem}
						onClick={() => {
							navigate('/profile');
							props.setModalOpen(false);
						}}
					>
						<span className="material-symbols-outlined">account_circle</span>
						<p>My Profile</p>
					</div>
					<div
						className={classes.modalItem}
						onClick={() => {
							navigate('/chat');
							props.setModalOpen(false);
						}}
					>
						<span className="material-symbols-outlined">group</span>
						<p>Group Chat</p>
					</div>
					<div className={classes.sep}></div>
					<div className={classes.modalItem} onClick={logout}>
						<span className="material-symbols-outlined">logout</span>
						<p>Logout</p>
					</div>
				</div>
			)}
		</>
	);
};

export default Modal;
