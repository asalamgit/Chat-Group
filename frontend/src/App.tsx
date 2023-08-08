import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './routes/SignIn/SignIn';
import SignUp from './routes/SignUp/SignUp';
import ProfileInfo from './routes/ProfileInfo/ProfileInfo';
import ProfileEdit from './routes/ProfileEdit/ProfileEdit';
import Header from './routes/Header/Header';
import { UserContext } from './contexts/user.context';
import { useContext, useEffect } from 'react';
import Chat from './routes/Chat/Chat';
import { ToastContainer } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const { currentUser } = useContext(UserContext);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate to="/signin" />} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/signup" element={<SignUp />} />
				{currentUser && (
					<>
						<Route path="/" element={<Header />}>
							<Route path="/profile" element={<ProfileInfo />} />
							<Route path="/profile-edit" element={<ProfileEdit />} />
						</Route>
						<Route path="/chat" element={<Chat />} />
					</>
				)}
				<Route path="*" element={<h1 style={{ color: 'white', width: '100%', textAlign: 'center' }}>404 NOT FOUND</h1>}></Route>
			</Routes>
			<ToastContainer theme="colored" autoClose={2000} />
		</BrowserRouter>
	);
}

export default App;
