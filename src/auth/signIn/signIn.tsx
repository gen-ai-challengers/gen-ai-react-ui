import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import getCheckoutTheme from '../signup/components/getCheckoutTheme';
import { useNavigate } from 'react-router-dom';
import ToggleColorMode from '../signup/components/ToggleColorMode';
import { useSelector, useDispatch } from 'react-redux';
import { signUpSuccess, selectUser, signUpClicked,selectSignUpSuccess } from '../authSlice';
import WebRtcAuth from '../../components/webRtc';
import FaceApi from '../../components/faceApi';
import Divider from '@mui/material/Divider';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
    </Box>
  );
}



export default function SignInLayout() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<PaletteMode>('light');
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const checkoutTheme = createTheme(getCheckoutTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const signUpSaved=useSelector(selectSignUpSuccess);
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  useEffect(() => {
    setActiveStep(1);
  },[signUpSaved]);
  const handleNext = () => {
    console.log(activeStep);
    if (activeStep == 0) {
      dispatch(signUpClicked(true));
    } else {
      setActiveStep(activeStep + 1);
    }

  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  const redirectToSignUp =()=>{
    navigate('/sign-up');
  }
  return (
    <ThemeProvider theme={showCustomTheme ? checkoutTheme : defaultTheme}>
      <CssBaseline />
      <Grid container sx={{ height: { xs: '100%', sm: '100dvh' } }}>
        <Grid
          item
          sm={12}
          md={7}
          lg={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'center',
            pt: { xs: 2, sm: 4 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
   
      
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >    
                 <React.Fragment>
                 <FaceApi action='face_recognition'/>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', sm: 'row' },
                    justifyContent: activeStep !== 0 ? 'space-between' : 'flex-end',
                    alignItems: 'end',
                    flexGrow: 1,
                    gap: 1,
                    pb: { xs: 12, sm: 0 },
                    mt: { xs: 2, sm: 0 },
                    mb: '60px',
                  }}
                >
                  {/* <WebRtcAuth  action='face_recognition'></WebRtcAuth> */}
               
                </Box>
              </React.Fragment>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
