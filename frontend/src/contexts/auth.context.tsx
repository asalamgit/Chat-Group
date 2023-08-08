import { createContext, useState, ReactNode, useEffect } from 'react';
import { IAccessToken } from '../interfaces/IAccessToken';

export const AuthContext = createContext<{
	accessToken: IAccessToken | null;
	setAccessToken: React.Dispatch<React.SetStateAction<null | IAccessToken>>;
}>({
	accessToken: null,
	setAccessToken: () => null,
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [accessToken, setAccessToken] = useState(() => {
		const storedAuth = localStorage.getItem('accessToken');
		return storedAuth ? JSON.parse(storedAuth) : null;
	});

	useEffect(() => {
		localStorage.setItem('accessToken', JSON.stringify(accessToken));
	}, [accessToken]);

	const value = { accessToken, setAccessToken };

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
