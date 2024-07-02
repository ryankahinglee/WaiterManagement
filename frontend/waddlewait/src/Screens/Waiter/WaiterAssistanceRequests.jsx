import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Drawer, Alert, Snackbar } from '@mui/material';
import { WaiterSidebar } from './layout/WaiterSidebar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';

import './waiter.css';

function MakeAssistance({ assistanceRequest, setAssistanceRequestAccepted, setAcceptedAssistanceRequest }) {
  const handleAcceptRequest = () => {
    axios.put('http://localhost:8000/assistance/notifications/accepted', {
      "table": assistanceRequest.table, 
      "staffName": assistanceRequest.staffName,
      "tableStatus": assistanceRequest.tableStatus
    })
    .then(response => {
      console.log(response.json);
    })
    .catch(error => {
      console.log(error);
    });
    setAssistanceRequestAccepted(true);
    setAcceptedAssistanceRequest(assistanceRequest);
  }

  // or orderRequest.wait_staff_assigned == is not me
  if (assistanceRequest.tableStatus) {
    return null;
  }
  return (
    <Card className="order-card" sx={{ minWidth: 300, maxHeight: 400, maxWidth: 300}}>
      <CardHeader
        title={"Table no " + assistanceRequest.table}
      />
      <CardContent className="order-card-contents">
        <FormControl fullWidth>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => {
              handleAcceptRequest();
            }}
        >
          Accept
        </Button>
        </FormControl>
      </CardContent>
    </Card>
  )
}

function WaiterAssistanceRequests() {

  const [acceptedAssistanceRequest, setAcceptedAssistanceRequest] = useState(null);
  const [assistanceRequestAccepted, setAssistanceRequestAccepted] = useState(false);
  const [assistanceRequests, setAssistanceRequests] = useState([]);

  const [latestAssistanceRequest, setLatestAssistanceRequest] = useState({})
  const [latestAccepetedAssistanceRequest, setLatestAccepetedAssistanceRequest] = useState({})
  const [newNotification, setNewNotification] = React.useState(false);
  const [notification, setNotification] = React.useState('');

  const handleCompletedAssistanceRequest = () => {
    axios.put('http://localhost:8000/assistance/notifications/completed', {
      "table": acceptedAssistanceRequest.table, 
      "staffName": acceptedAssistanceRequest.staffName,
      "tableStatus": false,
    })
    .then(response => {
      console.log(response.json);
    })
    .catch(error => {
      console.log(error);
    });
    setAssistanceRequestAccepted(false);
    setAcceptedAssistanceRequest(null);
    window.location.reload();
  }

  useEffect(() => {
    axios.get('http://localhost:8000/assistance/requests')
    .then(response => {
      const filteredRequests = response.data.filter(request => request.staffAcceptedTime === null);
      setAssistanceRequests(filteredRequests);
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    function checkNotifications() {

      // Get most updated version of assistance requests
      axios.get('http://localhost:8000/assistance/requests')
      .then(response => {
        const filteredRequests = response.data.filter(request => request.staffAcceptedTime === null);
        setAssistanceRequests(filteredRequests);
      })
      .catch(error => {
        console.log(error);
      });

      axios.get('http://localhost:8000/assistance/notificationscheck')
      .then(response => {
        let date1 = new Date(latestAssistanceRequest.most_recent_assistance_request)
        let date2 = new Date(response.data.most_recent_assistance_request)
        if (Object.keys(latestAssistanceRequest).length == 0 || 
          (Object.keys(latestAssistanceRequest).length !== 0 && date2 > date1)) {
          setNewNotification(true);
          setNotification("New assistance request by table " + response.data.table_data);
          axios.get('http://localhost:8000/assistance/requests')
          .catch(error => {
            console.log(error);
          });
        }
        setLatestAssistanceRequest(response.data);
      })
      .catch(error => {
        console.log(error);
      });

      axios.get('http://localhost:8000/assistance/notifications/acceptedcheck')
      .then(response => {
        console.log(response.data)
        if (latestAccepetedAssistanceRequest != {} && latestAccepetedAssistanceRequest.staff_accepted_time !== response.data.staff_accepted_time) {
          console.log(latestAccepetedAssistanceRequest,  response.data)
          setNewNotification(true);
          setNotification("Assistance request for table " + response.data.table_data + " was accepted");

          // axios.get('http://localhost:8000/assistance/requests')
          // .then(response => {
          //   const filteredRequests = response.data.filter(request => request.staffAcceptedTime === null);
          //   setAssistanceRequests(filteredRequests);
          //   console.log(response.data, "hi");
          // })
          // .catch(error => {
          //   console.log(error);
          // });
        }
        setLatestAccepetedAssistanceRequest(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    }

    const notificationLoop = setInterval(checkNotifications, 4000);

    // Cleanup function to stop the loop when the component unmounts
    return () => clearInterval(notificationLoop);
  }, [latestAssistanceRequest, latestAccepetedAssistanceRequest]);

  return (
    <div className="App">
        <Drawer 
        variant="permanent"
        anchor="left"
        >
            { <WaiterSidebar />}
        </Drawer>
        <div className="main-content">
          {
            assistanceRequestAccepted 
              ? (
                <div>
                  <h1>Assistance Request Table {acceptedAssistanceRequest.table} </h1>
                  <Button 
                    variant="contained" 
                    color="warning"
                    onClick={() => {
                      handleCompletedAssistanceRequest();
                    }}
                    autoFocus
                  >
                    Complete
                  </Button>
                </div>
              ) 
              : (
                // This will be displayed if assistance_request_accepted is false
                <div>
                  <h1>Assistance Requests</h1>
                  <hr />
                  <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} className="assistance-requests-container">
                    {assistanceRequests.map((request, index) => (
                      <MakeAssistance key={index}
                      assistanceRequest={request}
                      setAssistanceRequestAccepted={setAssistanceRequestAccepted}
                      setAcceptedAssistanceRequest={setAcceptedAssistanceRequest} />
                    ))}
                  </div>
                </div>
              )
          }
          <Snackbar open={newNotification} autoHideDuration={3000} 
            onClose={() => {
              setNewNotification(false)}
            }
          >
            <Alert
              onClose={() => setNewNotification(false)}
              severity="info"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {notification}
            </Alert>
          </Snackbar>
      </div>
    </div>
  );
}

export default WaiterAssistanceRequests;