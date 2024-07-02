import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Drawer } from '@mui/material';
import { KitchenSidebar } from './layout/KitchenSidebar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import './kitchen.css'

function MakeOrder({order}) {
  let orderNumber = "Order number " + order.id
  let tableNumber = "Table no " + order.table
  let tableItems = order.items
  let formattedTime = "Ordered on " + order.formatted_time

  return (
    <Card className="order-card" sx={{ minWidth: 400, maxHeight: 400, maxWidth: 400, overflowY: 'auto'}}>
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
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', margin: '10px 0'}} key={key}>
              <p> {tableItem.quantity} orders of Item {tableItem.name}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function KitchenOrderRequestsCompleted() {
  const [orderRequests, setOrderRequests] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/kitchenstaff/completed')
      .then(response => {
        setOrderRequests(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <Drawer 
        variant="permanent"
        anchor="left"
      >
        { <KitchenSidebar />}
      </Drawer>
      <div className="main-content">
        <h1>Completed Order Requests</h1>
        <hr/>
        <div className="order-card-container">
          {orderRequests.map((order, index) => (
            <MakeOrder key={index} order={order}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default KitchenOrderRequestsCompleted;