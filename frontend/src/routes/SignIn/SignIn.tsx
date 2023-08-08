import classes from './SignIn.module.scss';
import imgDevChallenge from '../../assets/devchallenges-light.svg';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { AuthContext } from '../../contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function SignIn() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [disabled, setDisabled] = useState(true);

	const { setCurrentUser } = useContext(UserContext);
	const { setAccessToken } = useContext(AuthContext);

	const navigate = useNavigate();

	useEffect(() => {
		if (username !== '' && password !== '') {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	}, [username, password]);

	const handleLogin = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.preventDefault();

		api
			.post(
				'/auth/login',
				{
					username: username,
					password: password,
				},
				{ withCredentials: true }
			)
			.then((response) => {
				setAccessToken(response.data.accessToken);
				api
					.get('/auth/profile', {
						headers: {
							Authorization: `Bearer ${response.data.accessToken.token}`,
						},
					})
					.then((res) => {
						setCurrentUser(res.data);
						navigate('/profile');
					})
					.catch((error) => {
						console.error(error.response.message);
					});
			})
			.catch((error) => {
				toast.error(error.response.data.message);
			});
	};

	return (
		<div className={classes.signIn}>
			<div className={classes.card}>
				<img className={classes.imgDevChallenge} src={imgDevChallenge} alt="devChallenge" />
				<h1>Login</h1>
				<div className={clsx(classes.divInput, classes.divInput1)}>
					<span className="material-symbols-rounded">mail</span>
					<input placeholder="Email" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
				<div className={clsx(classes.divInput, classes.divInput2)}>
					<span className="material-symbols-rounded">lock</span>
					<input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<button onClick={handleLogin} disabled={disabled}>
					Start coding now
				</button>
				<p className={classes.login}>
					Don’t have an account yet?{' '}
					<Link className={clsx(classes.Link)} to="/signup">
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}

export default SignIn;
