import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../App.css";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

export const ManagerSidebar = () => {
    const navigate = useNavigate();

    const handleCategoriesClick = () => {
        navigate('/manager/categories'); 
    };

    const handleMenuClick = () => {
        navigate('/manager/menu'); 
    };

    const handleManageItemsClick = () => {
        navigate('/manager/item-ordering'); 
    };

    const handleManageSignOut = () => {
        navigate("/"); 
    };

    const ManagerListItems = [
        { key: 'Menu', value: handleMenuClick },
        { key: 'Category Arrangement', value: handleCategoriesClick },
        { key: 'Menu Item Arrangment', value: handleManageItemsClick},
        { key: 'Sign Out', value: handleManageSignOut },
    ];

    return (
		<div className="ManagerSidebar">
			<List>
				{ManagerListItems.map(({key , value}) => (
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