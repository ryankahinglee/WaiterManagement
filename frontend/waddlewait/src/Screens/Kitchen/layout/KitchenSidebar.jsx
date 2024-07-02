import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../App.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

export const KitchenSidebar = () => {
	const navigate = useNavigate();

	const handleOrderRequestsClick = () => {
		navigate('/kitchen/order-requests'); 
	};

	const handleCompletedRequestsClick = () => {
		navigate('/kitchen/completed-requests'); 
	};

	const handleSignOutClick = () => {
		navigate("/"); 
	};

	const KitchenListItems = [
    { key: 'Order Requests', value: handleOrderRequestsClick },
    { key: 'Completed Requests', value: handleCompletedRequestsClick },
    { key: 'Sign Out', value: handleSignOutClick },
  ];

	return (
		<div className="KitchenSidebar">
			<List>
				{KitchenListItems.map(({key , value}) => (
					<ListItem className="list-item" key={key}>	
						<ListItemButton className="list-button" onClick={value} 
							sx={{'&:hover': {
									backgroundColor: '#fdfaf6',	
									color: '#dd6800'
								}
							}}
						>
							<ListItemText primary={key} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</div>
	);
};