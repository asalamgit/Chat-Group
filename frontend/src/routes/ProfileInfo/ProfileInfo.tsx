import { FC, useContext } from 'react';
import styles from './ProfileInfo.module.scss';
import { Link } from 'react-router-dom';
import { UserContext } from '../../contexts/user.context';

const ProfileInfo: FC = () => {
	const { currentUser } = useContext(UserContext);

	return (
		<>
			{currentUser && (
				<div className={styles.profileInfo}>
					<h1>Personal info</h1>
					<p className={styles.description}>Basic info, like your name and photo</p>
					<div className={styles.card}>
						<div className={styles.cardHeader}>
							<div className={styles.left}>
								<h2>Profile</h2>
								<p>Some info may be visible to other people</p>
							</div>
							<Link className={styles.link} to="/profile-edit">
								Edit
							</Link>
						</div>
						<div className={styles.photo}>
							<p>PHOTO</p>
							<img className={styles.imgDevChallenge} src={`http://${process.env.REACT_APP_API_URL}:3000/${currentUser.photo}`} alt="ProfilePhoto" />
						</div>
						<div className={styles.littleCards}>
							<p>NAME</p>
							<h3>{currentUser.name}</h3>
						</div>
						<div className={styles.littleCards}>
							<p>BIO</p>
							<h3>{currentUser.bio}</h3>
						</div>
						<div className={styles.littleCards}>
							<p>PHONE</p>
							<h3>{currentUser.phone}</h3>
						</div>
						<div className={styles.littleCards}>
							<p>EMAIL</p>
							<h3>{currentUser.email}</h3>
						</div>
						<div className={styles.littleCards}>
							<p>PASSWORD</p>
							<h3>************</h3>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProfileInfo;
