import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../App.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

export const WaiterSidebar = () => {
    const navigate = useNavigate();

    const handleOrderRequestsClick = () => {
        navigate("/waiter/order-requests"); 
    };

    const handleAssistanceRequestClick = () => {
        navigate("/waiter/assistance-requests"); 
    };

    const handleBillRequestsClick = () => {
        navigate("/waiter/bill-requests"); 
    };

    const handleSignOutClick = () => {
        navigate("/"); 
    };

    const WaiterListItems = [
        { key: 'Order Requests', value: handleOrderRequestsClick },
        { key: 'Assistance Requests', value: handleAssistanceRequestClick },
        { key: 'Bill Requests', value: handleBillRequestsClick },
        { key: 'Sign Out', value: handleSignOutClick },
    ];

    return (
        <div className="WaiterSidebar">
            <List>
                {WaiterListItems.map(({key , value}) => (
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