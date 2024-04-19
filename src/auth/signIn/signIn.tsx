
import React, { useState } from 'react';
import Button from '@mui/material/Button';

import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess, selectUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import FaceScanner from '../../components/FaceScanner';
import MediaPipe from '../../components/mediaPipe';
import axios from 'axios';
const SinIn = () => {
    const [signIn, setsignInAction] = useState(false);
    const navigate = useNavigate();
    const userData = useSelector(selectUser);
    const dispatch = useDispatch();
    const signInAction = () => { 
        setsignInAction(true);
        setTimeout(() => {
          // setsignInAction(false);
          // Code to be executed after the delay
          console.log('Delayed action performed');
        }, 2000);
        // console.log(signInAction)
      }
    return (
        <>
        <FaceScanner confirmScanAction={signIn} />
        <Button variant="contained" disabled={signIn} onClick={signInAction}>Sign In</Button>
        </>
    );
};

export default SinIn;