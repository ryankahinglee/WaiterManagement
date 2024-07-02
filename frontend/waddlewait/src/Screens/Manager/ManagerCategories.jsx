import React from 'react';
import { Button, Drawer, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { ManagerSidebar } from './layout/ManagerSidebar';
import axios from 'axios';

function ManagerCategories() {

    const [categories, setCategories] = React.useState([]);
    const [swapCategory, setSwapCategory] = React.useState('');
    const [hasChange, setNewChange] = React.useState(false);
    const [reRender, setreRender] = React.useState(false);

    const handleCategoryChange = (response) => {
        let cateOneSpot = response[1]
        let cateTwoSpot = response[2]

        let current = categories
        let temp = current[cateTwoSpot - 1]
        current[cateTwoSpot - 1] = current[cateOneSpot - 1]
        current[cateOneSpot - 1] = temp
        setCategories(current)


        // There are two categories with duplicate Ids
        setNewChange(true)
        
    };

    React.useEffect(() => {
		const fetchMenu = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:8000/menu/categories');
				const data = response.data;
				setCategories(data['categories'])

			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};
		fetchMenu();
        if (reRender == true) {
            window.location.reload();
            setreRender(false)
        }
	}, [reRender]);

    React.useEffect(() => {
        if (hasChange == true) {
            const categoryIds = categories.map((cate) => cate.id);
            // Save changes
            axios.post(`http://localhost:8000/menu/order/categories`, {
                categories: categoryIds,
            })
            .then(() => {
                setreRender(true)
            })
            .catch(error => {
                console.log(error);
            });
        }
    }, [hasChange])

    
	return (
		<div>
			<Drawer 
                variant="permanent"
            anchor="left"
            >
            { <ManagerSidebar />}
            </Drawer>
			<div style={{width: '85vw', height: '100vh', marginLeft: '15vw'}}>
				<h1>Category Arrangement</h1>
                <hr/>
                <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems:'center'}}>
                    {categories.map((cate, index) => (<div key={index}>
                        <CategoryItem index={index + 1} cate={cate} categories={categories} handleCategoryChange={handleCategoryChange} setSwapCategory={setSwapCategory}/>
                        <hr/>
                    </div>))}
                </div>
            </div>
        </div>
	);
}

function CategoryItem({cate, index, handleCategoryChange, categories, setSwapCategory}) {

    const [cateNumber, setCateNumber] = React.useState(index)

    const handleCateChange = (event) => {
        setCateNumber(event.target.value);

        handleCategoryChange([cate.id, index, event.target.value])
        setSwapCategory(cate.id)
    };
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', flexDirection:'row', width: '400px', marginTop: '10px', marginBottom: '10px'}}>
            <Button
                color="warning"
            >
                {cate.name}
            </Button>
            <FormControl sx={{width: '150px'}}>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cateNumber}
                    label="Category"
                    onChange={handleCateChange}
                >
                    {categories.map((cate, key) => (
                        <MenuItem key={cate.id} value={key + 1}>{key + 1}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

export default ManagerCategories;