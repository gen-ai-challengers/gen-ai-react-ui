import React, { useState }  from 'react';

import Box from '@mui/material/Box';
import { Card as MuiCard } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import FaceScanner from '../../components/FaceScanner';
import MediaPipe from "../../components/mediaPipe";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signUpSuccess, selectUser } from '../authSlice';
import FaceApi from '../../components/faceApi';
const Card = styled(MuiCard)<{ selected?: boolean }>(({ theme, selected }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  width: '100%',
  '&:hover': {
    background:
      theme.palette.mode === 'light'
        ? 'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)'
        : 'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
    borderColor: theme.palette.mode === 'light' ? 'primary.light' : 'primary.dark',
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 2px 8px hsla(0, 0%, 0%, 0.1)'
        : '0px 1px 8px hsla(210, 100%, 25%, 0.5) ',
  },
  [theme.breakpoints.up('md')]: {
    flexGrow: 1,
    maxWidth: `calc(50% - ${theme.spacing(1)})`,
  },
  ...(selected && {
    backgroundColor: theme.palette.action.selected,
    borderColor:
      theme.palette.mode === 'light'
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
  }),
}));

const CameraContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  padding: theme.spacing(3),
  borderRadius: '20px',
  border: '1px solid ',
  borderColor: theme.palette.divider,
  background:
    theme.palette.mode === 'light'
      ? 'linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.3) 25%, hsla(210, 100%, 90%, 0.3) 100%)'
      : 'linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)',
  boxShadow: '0px 4px 8px hsla(210, 0%, 0%, 0.05)',
  [theme.breakpoints.up('xs')]: {
    height: 300,
  },
  [theme.breakpoints.up('sm')]: {
    height: 350,
  },
}));

const FormGrid = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function PaymentForm() {
  const [addAction, setAddAction] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();
  const addfaceAction = () => { 
    setAddAction(true);
    setTimeout(() => {
      // setAddAction(false);
      // Code to be executed after the delay
      console.log('Delayed action performed');
    }, 2000);
    // console.log(addAction)
  }


  return (
    <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <CameraContainer>
            <Box
              sx={{
                justifyContent: 'space-between',
                width: '100%',
                gap: 2,
              }}
            >
              {/* <FaceScanner confirmScanAction={addAction} /> */}
              <FaceApi/>
            </Box>
            {/* <Box sx={{ display: 'flex', gap: 2 }}>
            </Box> */}
          </CameraContainer>
        </Box>
      
    </Stack>
  );
}
