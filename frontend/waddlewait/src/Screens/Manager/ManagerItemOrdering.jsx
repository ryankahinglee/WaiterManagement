import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, FormControl, Select, InputLabel, MenuItem, Tab, Box, Tabs} from '@mui/material';
import {
    TabPanel,
    TabContext
  } from '@mui/lab';
import { ManagerSidebar } from './layout/ManagerSidebar';
import axios from 'axios';

function ManagerItemOrdering() {
	const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [cateId, setCateId] = React.useState(1)
    const [reRender, setreRender] = React.useState(false);

    const handleChangeTab = (event, newCateId) => {
		setCateId(newCateId);
	};

    const handleChange = (indexOne, indexTwo) => {
        axios.get(`http://127.0.0.1:8000/menu/order/categorised/${cateId}`)
        .then((response) => {
            let currentOrder = response.data.menuItems
            
            let newOrder = []
            for (let i = 1; i < currentOrder.length + 1; i++) {
                if (i == indexOne) {
                    newOrder.push(currentOrder[indexTwo-1].id)
                } else if (i == indexTwo) {
                    newOrder.push(currentOrder[indexOne-1].id)
                } else {
                    newOrder.push(currentOrder[i-1].id)
                }
            }            
            axios.post(`http://127.0.0.1:8000/menu/order/categorised/${cateId}/`, {
                menuItems: newOrder
            })
            .then((response) => {
                console.log(response.data)
                setreRender(true)

            })
            .catch((error) => {
                console.log(error)
            })
        })
        .catch((error) => {
            console.log(error)
        })
    }

    React.useEffect(() => {
		const fetchMenu = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:8000/menu');
				const data = response.data;
				setCategories(data['categories'])
				setItems(data['menuItems'])
                console.log(data['menuItems'])

				if (reRender == true) {
                    setreRender(false)
					window.location.reload();
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchMenu();
	}, [reRender]);

	return (
		<div className="App">
			<Drawer 
                variant="permanent"
            anchor="left"
            >
            { <ManagerSidebar />}
            </Drawer>
            <div style={{width: '85vw', height: '100vh', marginLeft: '15vw'}}>
				<h1>Menu Items</h1>
                <hr/>
                <TabContext value={String(cateId)}>
                    <Box sx={{paddingY: '5px', borderBottom: 1, borderColor: 'divider', justifyContent: 'space-between', display: 'flex', flexDirection: 'row'}}>
                        <Tabs sx={{marginLeft: '20px' }}value={String(cateId)} 
                            onChange={handleChangeTab}
                            textColor="inherit"
                            indicatorColor="inherit"
                        >
                            {categories.map((cate) => (
                                <Tab key={cate.id} label={cate.name} value={String(cate.id)} />
                            ))}
                        </Tabs>
                    </Box>
                    {categories.map((cate) => (
						<TabPanel value={String(cate.id)} key={cate.id}>
							<Items items={items} cateId={cate.id} handleChange={handleChange}/>
						</TabPanel>
					))}
                </TabContext>
            </div>
		</div>
	);
}

function Items({ items, cateId, handleChange}) {
    var cateItems = [];
  

    axios.get(`http://127.0.0.1:8000/menu/order/categorised/${cateId}`)
    .then((response) => {
        console.log(response.data)
        cateItems = response.data.menuItems
    })
    .catch((error) => {
        console.log(error)
    })
    for (var index in items) {
      var item = items[index];
      if (item.category.id === cateId) {
          cateItems.push(item);
      }
    }
  
    return (
      <div style={{display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems: 'center'}}>
        {cateItems.map((item, index) => (
            <MenuItemBlock key={index} items={cateItems} item={item} index={index + 1} handleChange={handleChange}/>
        ))}
      </div>
    )
}

function MenuItemBlock({item, items, index, handleChange}) {

    const [menuNum, setMenuNum] = React.useState(index)

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection:'row', width: '400px', marginTop: '10px', marginBottom: '10px'}}>
            <Button
                color="warning"
            >
                {item.name}
            </Button>
            <FormControl sx={{width: '150px'}}>
                <InputLabel id="demo-simple-select-label">Item</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={menuNum}
                    label="Item"
                    onChange={(event) => {
                        setMenuNum(event.target.value)
                        handleChange(index, event.target.value)
                    }}
                >
                    {items.map((item, index) => ( 
                        <MenuItem key={item.id} value={index + 1}>{index + 1}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}


export default ManagerItemOrdering;