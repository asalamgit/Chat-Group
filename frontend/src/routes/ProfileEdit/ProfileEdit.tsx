import classes from './ProfileEdit.module.scss';
// import imgDevChallenge from '../../assets/devchallenges-light.svg';
import { Link, useNavigate } from 'react-router-dom';
import ChangePhoto from './components/ChangePhoto/ChangePhoto';
import ChangeText from './components/ChangeText/ChangeText';
import { getNewAccessToken } from '../../utils/refreshToken';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/auth.context';
import { UserContext } from '../../contexts/user.context';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function ProfileEdit() {
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [uploadedFile, setUploadedFile] = useState<File | null>();

	const { currentUser, setCurrentUser } = useContext(UserContext);
	const { accessToken, setAccessToken } = useContext(AuthContext);

	const navigate = useNavigate();

	const updateUser = async () => {
		const newAccessToken = await getNewAccessToken(accessToken?.iat);
		if (newAccessToken) {
			setAccessToken(newAccessToken);
		}

		if (password.trim() !== '') {
			if (password !== confirmPassword) {
				toast.error('Password and confirm password are different');
				return;
			}
		}

		if (name.trim() !== '' && name.trim().length < 2) {
			toast.error('The name must be at least 2 characters long');
			return;
		}
		if (bio.trim() !== '' && bio.trim().length < 2) {
			toast.error('The bio must be at least 2 characters long');
			return;
		}
		if (phone.trim() !== '' && phone.trim().length < 10) {
			toast.error('The phone must be at least 10 characters long');
			return;
		}

		const formData = new FormData();
		if (uploadedFile) formData.append('image', uploadedFile);
		if (name.trim() !== '') formData.append('name', name);
		if (bio.trim() !== '') formData.append('bio', bio);
		if (phone.trim() !== '') formData.append('phone', phone);
		if (password.trim() !== '') formData.append('password', password);

		api
			.post(`/auth/profile`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${newAccessToken ? newAccessToken.token : accessToken && accessToken.token}`,
				},
			})
			.then((res) => {
				setCurrentUser(res.data);
				navigate('/profile');
			})
			.catch((error) => {
				toast.error(error.response.data.message);
			});
	};

	return (
		<div className={classes.profileEdit}>
			<div className={classes.card}>
				<Link className={classes.backDiv} to="/profile">
					<span className="material-symbols-outlined">arrow_back_ios_new</span>
					<p>Back</p>
				</Link>
				<h1>Change Info</h1>
				<p className={classes.intro}>Changes will be reflected to every services</p>
				<ChangePhoto setUploadedFile={setUploadedFile} photo={currentUser && currentUser.photo} />
				<ChangeText title="Name" placeHolder="Enter your name..." value={name} setValue={setName} />
				<ChangeText title="Bio" placeHolder="Enter your bio..." textarea value={bio} setValue={setBio} />
				<ChangeText title="Phone" placeHolder="Enter your phone..." value={phone} setValue={setPhone} />
				<ChangeText title="Password" placeHolder="Enter your password..." password value={password} setValue={setPassword} />
				<ChangeText title="Confirm password" placeHolder="Confirm your password..." password value={confirmPassword} setValue={setConfirmPassword} />
				<button className={classes.save} onClick={updateUser}>
					Save
				</button>
			</div>
		</div>
	);
}

export default ProfileEdit;
