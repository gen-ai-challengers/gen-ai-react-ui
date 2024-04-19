// DefaultLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet for child routes
import HeaderMenu from './header/header';
import FooterCentered from './footer/footer';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
const DefaultLayout = ({ }) => {
  console.log()
  return (
    <React.Fragment>
      <CssBaseline />
      <HeaderMenu />
      <Container maxWidth="xs" >
        <Box sx={{ position: 'relative', height: '100vh',display:'flex',flexDirection: 'column' }} >
              <Outlet />
            <FooterCentered />
        </Box>
      </Container>
    </React.Fragment>

  );
};

export default DefaultLayout;
