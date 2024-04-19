import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LoginIcon from '@mui/icons-material/Login';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { useNavigate } from 'react-router-dom';
export default function FooterCentered() {
  const navigate=useNavigate();
  const [value, setValue] = React.useState(0);
  return (
    <Box sx={{width:'100%', position: 'absolute',bgcolor: 'background.paper',bottom:0, display: 'flex', justifyContent: 'center' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
         // setValue(newValue);
         navigate(newValue)
        }}
      >
        <BottomNavigationAction label="Login" value="/sign-in"  icon={<LoginIcon />} />
        <BottomNavigationAction label="Face Recognition" value="/"   icon={<DocumentScannerIcon />} />
        <BottomNavigationAction label="Register" value="/sign-up"  icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Box>
  );
}