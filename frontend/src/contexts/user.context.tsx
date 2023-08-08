import { createContext, useState, ReactNode, useEffect } from 'react';
import { IUser } from '../interfaces/IUser';

export const UserContext = createContext<{
	currentUser: IUser | null;
	setCurrentUser: React.Dispatch<React.SetStateAction<null | IUser>>;
}>({
	currentUser: null,
	setCurrentUser: () => null,
});

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const [currentUser, setCurrentUser] = useState(() => {
		const storedUser = localStorage.getItem('currentUser');
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		localStorage.setItem('currentUser', JSON.stringify(currentUser));
	}, [currentUser]);

	const value = { currentUser, setCurrentUser };

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
