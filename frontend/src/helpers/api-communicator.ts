import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
	const res = await axios.post('/user/login', { email, password });
	if (res.status !== 200) {
		throw new Error('Error logging in');
	}
	const data = await res.data;
	return data;
};

export const checkAuthStatus = async () => {
	const res = await axios.get('/user/auth-status');
	if (res.status !== 200) {
		throw new Error('Error checking auth status');
	}
	const data = await res.data;
	return data;
};

export const sendChatRequest = async (message: string) => {
	const res = await axios.post('/chat/new', { message });
	if (res.status !== 200) {
		throw new Error('Error sending chat data');
	}
	const data = await res.data;
	return data;
};

export const getUserChats = async () => {
	const res = await axios.get('/chat/all-chats');
	if (res.status !== 200) {
		throw new Error('Error sending chat data');
	}
	const data = await res.data;
	return data;
};

export const deleteUserChats = async () => {
	const res = await axios.delete('/chat/delete');
	if (res.status !== 200) {
		throw new Error('Error deleting chat data');
	}
	const data = await res.data;
	return data;
};
