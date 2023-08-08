import { Outlet } from 'react-router-dom';
import classes from './Header.module.scss';
import imgDevChallenge from '../../assets/devchallenges-light.svg';
import ModalInterruptor from './components/ModalInterruptor/ModalInterruptor';

const Header = () => {
	return (
		<>
			<div className={classes.header}>
				<img className={classes.imgDevChallenge} src={imgDevChallenge} alt="devChallenge" />
				<ModalInterruptor />
			</div>
			<Outlet />
		</>
	);
};

export default Header;
