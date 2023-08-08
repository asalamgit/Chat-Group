import api from './api';

export const getNewAccessToken = async (iat: number | undefined) => {
	if (iat && iat > Date.now()) return;
	return api
		.get(`/auth/getAccessToken`, { withCredentials: true })
		.then((res) => {
			return res.data;
		})
		.catch((error) => {
			console.error(error.response.data.message);
		});
};
