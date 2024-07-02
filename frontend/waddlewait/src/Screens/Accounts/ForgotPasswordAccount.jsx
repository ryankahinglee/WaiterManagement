import React from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

function ForgotPasswordAccount() {
	const navigate = useNavigate();

	const navigateTo = (link) => {
		navigate(link);
	}

	// Use states

	// Dialog
	const [success, setSuccessOpen] = React.useState(false);

	return (
		<div className="account-screen">
			<div className="account-container">
				<h1>
					Password Recovery
				</h1>
				<p>Enter your username and we will send a password recovery to your email.</p>
				<div className="input-container">
					<TextField
						label="Username"
						className="input-login"
					/>
				</div>
				<div className="create-options">
					<div className="button-container">
						<Button 
							variant="outlined"
							onClick={() => {
								navigateTo('/staff/login');
							}}
							color='warning'
							className="button"
						>
							Back
						</Button>
					</div>
					<div className="button-container">
						<Button 
							variant="outlined"
							onClick={() => {
								setSuccessOpen(true);
							}}
							color='warning'
							className="button"
						>
							Submit
						</Button>
						<SuccessDialog open={success} setOpen={setSuccessOpen} navigateTo={navigateTo} />
					</div>
				</div>
			</div>
		</div>
	);
}

function SuccessDialog ({open, setOpen, navigateTo}) {
	return <Dialog
		open={open}
		onClose={() => {
			setOpen(false)
			navigateTo('/staff/login');
		}}
	>
		<DialogTitle>Password Recovery Sent</DialogTitle>
		<p>A password recovery has been sent. Please check your email.</p>
		<Button
			variant="outlined"
			onClick={() => {
				setOpen(false);
				navigateTo('/staff/login');
			}}	
			color="warning"	
		>
			Close
		</Button>
	</Dialog>
}

export default ForgotPasswordAccount;