import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button} from '@mui/material';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import './accounts.css'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

function Login() {
	const navigate = useNavigate();

	const navigateTo = (link) => {
		if (link === 'kitchen_staff') {
			navigate('/kitchen/order-requests');
		}
		else if (link === 'wait_staff') {
			navigate('/waiter/order-requests');
		}
		else if (link === 'manager') {
			navigate('/manager/menu');
		}
		else {
			navigate(link);
		}
	}

	const [username, setUserName] = React.useState('');
	const [password, setPassword] = React.useState('');

	
	const [error, setErrorOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState(false);

	return (
		<div className="account-screen">
			<div className="account-container">
				<h1>
					Login
				</h1>
				<Box
					className="input-container"
					component="form"
				>
					<TextField
						label="Username"
						className="input-login"
						onChange={(event) => {
							setUserName(event.target.value)
						}}
						autoComplete='off'
					/>
				</Box>
				<Box 
					className="input-container"
					component="form"
				>
					<TextField
						label="Password"
						type="password"
						className="input-login"
						onChange={(event) => {
							setPassword(event.target.value)
						}}
						autoComplete='off'
					/>
				</Box>
				<div className="button-container">
					<Button 
						variant="outlined"
						onClick={() => {
							navigateTo('/');
						}}
						className="button"
						color='warning'
					>
						Back
					</Button>
					<Button 
						variant="outlined"
						onClick={async () => {
							// Authentication goes here

							if (username === "" || password === "") {
								setErrorMessage("Login failed. Please ensure all fields are filled.");
								setErrorOpen(true);
								return;
							} 

							try {
								const response = await axios.post('http://127.0.0.1:8000/authentication/login', {
									email: username,
									password: password,
								});

								// Handle successful login, e.g., store token in local storage
								navigateTo(response.data.role);
							} catch (error) {
								console.log(error)
								setErrorMessage("Login failed. Please check your username/password/role and try again.")
								setErrorOpen(true);
								return;
							}
						}}
						color='warning'
						className="button"
					>
						Submit
					</Button>
					<ErrorDialog open={error} setOpen={setErrorOpen} message={errorMessage}/>
				</div>
				<div className="login-help">
					<div className="login-help-link-container">
						<p 
							className="login-help-link-text"
							onClick={() => {
								navigateTo('/staff/create-account');
							}}
						>
							Create account
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function ErrorDialog ({open, setOpen, message}) {
	return <Dialog
		open={open}
		onClose={() => {
			setOpen(false)
		}}
	>
		<DialogTitle>Error</DialogTitle>
		<p>{message}</p>
		<Button
			variant="outlined"
			onClick={() => {
				setOpen(false);
			}}
			color="warning"
		>
			Close
		</Button>
	</Dialog>
}

export default Login;