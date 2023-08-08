import classes from './SignUp.module.scss';
import clsx from 'clsx';
import imgDevChallenge from '../../assets/devchallenges-light.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { AuthContext } from '../../contexts/auth.context';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function SignUp() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [disabled, setDisabled] = useState(true);

	const { setCurrentUser } = useContext(UserContext);
	const { setAccessToken } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (username.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '') {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [username, password, confirmPassword]);

	const handleSignup = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			toast.error('Password and confirm password are different');
			return;
		}

		if (password.length < 8) {
			toast.error('The password must be at least 8 characters long');
			return;
		}

		api
			.post(
				`/users`,
				{
					email: username,
					password: password,
				},
				{ withCredentials: true }
			)
			.then((response) => {
				setAccessToken(response.data.accessToken);
				api
					.get(`/auth/profile`, {
						headers: {
							Authorization: `Bearer ${response.data.accessToken.token}`,
						},
					})
					.then((res) => {
						setCurrentUser(res.data);
						navigate('/profile');
					})
					.catch((error) => {
						console.error(error.response.data);
					});
			})
			.catch((error) => {
				toast.error(error.response.data.response.message);
			});
	};

	return (
		<div className={classes.signUp}>
			<div className={classes.card}>
				<img className={classes.imgDevChallenge} src={imgDevChallenge} alt="devChallenge" />
				<h1>Join thousands of learners from around the world</h1>
				<p className={classes.intro}>Master web development by making real-life projects. There are multiple paths for you to choose</p>
				<div className={clsx(classes.divInput, classes.divInput1)}>
					<span className="material-symbols-rounded">mail</span>
					<input placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<div className={clsx(classes.divInput, classes.divInput2)}>
					<span className="material-symbols-rounded">lock</span>
					<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<div className={clsx(classes.divInput, classes.divInput2)}>
					<span className="material-symbols-rounded">lock</span>
					<input placeholder="Confirm assword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
				</div>
				<button onClick={handleSignup} disabled={disabled}>
					Start coding now
				</button>
				<p className={classes.login}>
					Already a member?{' '}
					<Link className={clsx(classes.Link)} to="/signin">
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}

export default SignUp;
