import React, { useEffect } from 'react';
import { IoIosLogIn } from 'react-icons/io';
import { Box, Typography, Button } from '@mui/material';
import CustomizedInput from '../components/shared/CustomizedInput';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const navigate = useNavigate();
	const auth = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		try {
			toast.loading('Logging in...', { id: 'login' });
			await auth?.login(email, password);
			toast.dismiss('login');
			toast.success('Logged in successfully');
			navigate('/chat');
		} catch (error) {
			console.log(error);
			toast.dismiss('login');
			toast.error('Signing In Failed', { id: 'login' });
		}
	};

	// if user is logged in redirect to /chat
	useEffect(() => {
		if (auth?.user) {
			return navigate('/chat');
		}
	}, [auth, navigate]);

	return (
		<Box
			width={'100%'}
			height={'100%'}
			display="flex"
			flex={1}
			component="section"
			sx={{ p: 2, border: '1px dashed grey' }}
		>
			<Box padding={8} mt={8} display={{ md: 'flex', sm: 'none', xs: 'none' }}>
				<img src="airobot.png" alt="Robot" style={{ width: '400px' }} />
			</Box>
			<Box
				display={'flex'}
				flex={{ xs: 1, md: 0.5 }}
				justifyContent={'center'}
				alignItems={'center'}
				padding={2}
				ml={'auto'}
				mt={16}
			>
				<form
					onSubmit={handleSubmit}
					style={{
						margin: 'auto',
						padding: '30px',
						boxShadow: '10px 10px 20px #000',
						borderRadius: '10px',
						border: 'none',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
						}}
					>
						<Typography
							variant="h4"
							align="center"
							padding={2}
							fontWeight={600}
						>
							Login
						</Typography>
						<CustomizedInput type="email" name="email" label="email" />
						<CustomizedInput type="password" name="password" label="password" />
						<Button
							type="submit"
							sx={{
								px: 2,
								py: 1,
								mt: 2,
								width: '400px',
								borderRadius: 2,
								bgcolor: '#00fffc',
								':hover': {
									bgcolor: 'white',
									color: 'black',
								},
							}}
							endIcon={<IoIosLogIn />}
						>
							Login
						</Button>
					</Box>
				</form>
			</Box>
		</Box>
	);
};

export default Login;
