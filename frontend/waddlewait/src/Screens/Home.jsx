import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button,
  Typography,
  Grid
} from '@mui/material';

function Home() {
  const navigate = useNavigate();
  
  const navigateTo = (link) => {
    navigate(link);
  }

  return (
    <>
      <div className="customer-screen">
        <Typography variant="h2">
          WaddleWait
        </Typography>
        <br /><br /><br />
        <div className="customer-container">
          <p>
            Please select your page:
          </p>
          <Grid container spacing={5} style={{ justifyContent: 'center' }}>
            <Grid item>
              <Button 
                variant='outlined'
                onClick={() => navigate('/staff/login')}
                color='warning'
              >
                Staff Login
              </Button>
            </Grid>

            <Grid item>
              <Button 
                variant='outlined'
                onClick={() => navigateTo('/customer')}
                color='warning'
              >
                Costumer
              </Button>
            </Grid>
          </Grid>
          <br />
      </div>
    </div>
    </>
  );
}

export default Home;
  