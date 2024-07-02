import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Alert, Snackbar } from '@mui/material';
import { KitchenSidebar } from './layout/KitchenSidebar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import './kitchen.css'

function MakeOrder({order, getOrders, setOrders}) {
  
  let orderNumber = "Order number " + order.id
  let tableNumber = "Table no " + order.table
  let formattedTime = "Ordered on " + order.formatted_time
  let tableItems = order.items

  return (
    <Card className="order-card" sx={{ minWidth: 400, maxHeight: 500, maxWidth: 400, overflowY: 'auto'}}>
      <CardHeader
        title={orderNumber}
        subheader={
          <>
            <Typography variant="subtitle1">{tableNumber}</Typography>
            <Typography variant="subtitle2">{formattedTime}</Typography>
          </>
        }
      />
      <CardContent className="order-card-contents">
        <div>
          {tableItems.map((tableItem, key) => (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '10px 0', overflowY: 'auto', alignItems: 'center'}} key={key}>
              <p> {tableItem.quantity}x {tableItem.name}</p>
              <ItemStatus orderId={order.id} itemId={tableItem.id} itemPrepare={tableItem.is_preparing} itemReady={tableItem.is_ready}/>
            </div>
          ))}
        </div>
        <Button 
          variant="contained" 
          color="warning"
          onClick={() => {
            // Mark all items as complete
            for (let i = 0; i < tableItems.length; i++) {
              const tableItem = tableItems[i];
              axios.put(`http://localhost:8000/kitchenstaff/ready/${order.id}/${tableItem.id}`)
              .catch(error => {
                console.log(error);
              });
            }
            axios.put(`http://localhost:8000/kitchenstaff/complete/${order.id}`)
            .then(() => {
              let currentOrders = getOrders;
              let filteredOrders = currentOrders.filter(currentOrder => currentOrder.id !== order.id);
              setOrders(filteredOrders);
              window.location.reload();
            })
            .catch(error => {
              console.log(error);
            });

          }}
        >
          Complete
        </Button>
      </CardContent>
    </Card>
  )
}

function ItemStatus({orderId, itemId, itemPrepare, itemReady}) {
  let findStatus = "Not Started";
  if (itemReady == true) {
    findStatus = "Ready";
  } else if (itemPrepare == true) {
    findStatus = "Preparing";
  } else {
    findStatus = "Not Started";
  }

  const [status, setStatus] = useState(findStatus);

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (status === "Preparing") {
      axios.put(`http://localhost:8000/kitchenstaff/prepare/${orderId}/${itemId}`)
      .catch(error => {
        console.log(error);
      });
    } else if (status === "Ready") {
      axios.put(`http://localhost:8000/kitchenstaff/ready/${orderId}/${itemId}`)
      .catch(error => {
        console.log(error);
      });
    } else if (status === "Not Started") {
      axios.put(`http://localhost:8000/kitchenstaff/reset/${orderId}/${itemId}`)
      .catch(error => {
        console.log(error);
      });
    }
  }, [status])

  return (
    <FormControl style={{margin: '10px'}}>
      <InputLabel id="demo-simple-select-label">Status</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={status}
        label="status"
        onChange={handleStatus}
      >
        <MenuItem value={"Not Started"}>Not Started</MenuItem>
        <MenuItem value={"Preparing"}>Preparing</MenuItem>
        <MenuItem value={"Ready"}>Ready</MenuItem>
      </Select>
    </FormControl>
  )
}

function KitchenOrderRequests() {

  const [orderRequests, setOrderRequests] = useState([]);
  
	const [open, setOpen] = React.useState(false);
  
  const navigate = useNavigate(); 
  const toggleSignOut = () => {
    navigate("/staff/login");
	};
  
	const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
	};
  
  const [newOrder, setNewOrder] = React.useState(false);
  const [lastOrder, setLastOrder] = useState({})
  const [checkLast, setCheckLast] = useState({})

  useEffect(() => {
    axios.get('http://localhost:8000/kitchenstaff/pending ')
      .then(response => {
        setOrderRequests(response.data);
        
        if (checkLast != lastOrder) {
          if (checkLast.id + 1 == lastOrder.id) {
            setNewOrder(true);
          }
        }
        setCheckLast(lastOrder)
      })
      .catch(error => {
        console.log(error);
      });
    }, [lastOrder]);
    
    

  useEffect(() => {
    function checkNotifications() {
      axios.get('http://localhost:8000/kitchenstaff/new')
      .then(response => {
        setLastOrder(response.data) 
      })
      .catch(error => {
        console.log(error);
      });
    }

    const notificationLoop = setInterval(checkNotifications, 4000);

    // Cleanup function to stop the loop when the component unmounts
    return () => clearInterval(notificationLoop);
  }, []);

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Drawer 
        variant="permanent"
        anchor="left"
      >
        { <KitchenSidebar />}
      </Drawer>
      <div style={{width: '85vw', height: '100vh', marginLeft: '15vw'}}>
        <h1>Order Requests</h1>
        <hr/>
        <div className="kitchen-orders-container">
          {orderRequests.map((order, index) => (
            <MakeOrder key={index} order={order} getOrders={orderRequests} setOrders={setOrderRequests}/>
          ))}
        </div>
      </div>
      <Snackbar open={newOrder} autoHideDuration={3000} 
        onClose={() => {
          setNewOrder(false)}
        }
      >
        <Alert
          onClose={() => setNewOrder(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          A new order has arrived!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default KitchenOrderRequests;