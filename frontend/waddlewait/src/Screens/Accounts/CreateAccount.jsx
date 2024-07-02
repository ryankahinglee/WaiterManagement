import React from 'react';
import './accounts.css'
import { TextField, Button, InputLabel, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

function CreateStaffAccount() {
	const navigate = useNavigate();

	const navigateTo = (link) => {
		navigate(link);
	}

	// Use States
	// Input fields
	const [name, setName] = React.useState('');
	const [username, setUsername] = React.useState('');
	const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

	// Dialog
	const [error, setErrorOpen] = React.useState(false);
	const [success, setSuccessOpen] = React.useState(false);
	const [errorMessage, setErrorMessage] = React.useState(false);

	const [role, setRole] = React.useState('');

	const roleChange = (event) => {
		setRole(event.target.value);
	};

	return (
		<div className="account-screen">
			<div className="account-container">
				<h1>
					Register
				</h1>
				<Box className="input-container" component="form">
					<TextField
						label="Name"
						placeholder='Jane_Doe'
						className="input-register"
						onChange={(e) => setName(e.target.value)}
						autoComplete='off'
					/>
				</Box>
				<Box className="input-container" component="form">
					<TextField
						label="Email"
						placeholder='example@gmail.com'
						className="input-register"
						onChange={(e) => setUsername(e.target.value)}
						autoComplete='off'
					/>
				</Box>
				<Box className="input-container" component="form">
					<TextField
						label="Password"
						className="input-register"
						type="password"
						onChange={(e) => setPassword(e.target.value)}
						autoComplete='off'
					/>
				</Box>
				<Box className="input-container" component="form">
					<TextField
						label="Confirm Password"
						className="input-register"
						type="password"
						onChange={(e) => setConfirmPassword(e.target.value)}
						autoComplete='off'
					/>
				</Box>
				<div className='input-role-container'>
                    <FormControl className="input-role">
                        <InputLabel>Role</InputLabel>
                        <Select
                            id="demo-simple-select"
                            value={role}
                            label="Role"
                            onChange={roleChange}
                        >
                            <MenuItem value={"kitchen_staff"}>Kitchen Staff</MenuItem>
                            <MenuItem value={"wait_staff"}>Wait Staff</MenuItem>
                            <MenuItem value={"manager"}>Manager</MenuItem>
                        </Select>
                    </FormControl>
                </div>
				<div className="create-options">
					<div className="button-container">
						<Button 
							variant="outlined"
							onClick={() => {
								navigateTo('/staff/login');
							}}
							className="button"
							color='warning'
						>
							Back
						</Button>
					</div>
					<div className="button-container">
						<Button 
							variant="outlined"
							onClick={async () => {
									// Authentication goes here
									// Check that fields cannot be empty
									if (name === ""  || password === "" || username === "" || role === "") {
										setErrorMessage("Please ensure all fields are filled");
										setErrorOpen(true);
										return;
									}
									
									// Passwords are same
									if (password !== confirmPassword) {
										setErrorMessage("Password/Confirm Password are not the same.")
										setErrorOpen(true);
										return;
									}
									try {
										const response = await axios.post('http://127.0.0.1:8000/authentication/register', {
									   	name: name,
											email: username,
											password: password,
											role: role
										});

										// Handle successful register
										setSuccessOpen(true);
									} catch (error) {
										console.log(error)
										if (error.response.status === 404) {
									   		setErrorMessage("Login failed. Please check your name/username/password and try again.")
											setErrorOpen(true);
										}
										if (error.response.status === 400) {
											setErrorMessage("Login failed. Email already in use.")
											setErrorOpen(true);
										}
										return;
									}
									
								// Temporary basic authentication

								// Check Passwords are the same



								setSuccessOpen(true);
							}}
							className="button"
							color='warning'
						>
							Create
						</Button>
						<ErrorDialog open={error} setOpen={setErrorOpen} errorMessage={errorMessage}/>
						<SuccessDialog open={success} setOpen={setSuccessOpen} navigateTo={navigateTo} />
					</div>
				</div>
			</div>
		</div>
	);
}

function ErrorDialog ({open, setOpen, errorMessage}) {
	return <Dialog
		open={open}
		onClose={() => {
			setOpen(false)
		}}
		PaperProps={{
			style: {
				maxWidth: '400px',
				width: '100%',
				padding: '10px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			},
		}}
	>
		<DialogTitle>Register Error</DialogTitle>
		<p>{errorMessage}</p>
		<Button
			variant="outlined"
			onClick={() => {
				setOpen(false);
			}}
			style={{width: '50%'}}
			color="warning"
		>
			Close
		</Button>
	</Dialog>
}

function SuccessDialog ({open, setOpen, navigateTo}) {
	return <Dialog
		open={open}
		onClose={() => {
			setOpen(false)
			navigateTo('/staff/login');
		}}
		PaperProps={{
			style: {
				maxWidth: '400px',
				width: '100%',
				padding: '10px',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			},
		}}
	>
		<DialogTitle>Success</DialogTitle>
		<p>Your account has been registered</p>
		<Button
			variant="outlined"
			onClick={() => {
				setOpen(false);
				navigateTo('/staff/login');
			}}
			style={{width: '50%'}}
			color="warning"
		>
			Close
		</Button>
	</Dialog>
}

export default CreateStaffAccount;