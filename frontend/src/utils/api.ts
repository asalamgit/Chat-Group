import axios from 'axios';

export default axios.create({
	baseURL: `http://${process.env.REACT_APP_API_URL}:3000`,
	withCredentials: true,
});
