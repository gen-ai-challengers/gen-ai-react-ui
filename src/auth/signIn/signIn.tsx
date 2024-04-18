
import React, { useState } from 'react';
import { TextInput, Checkbox, Button, Group, Box, Card, PasswordInput, Container, Grid, } from '@mantine/core';
import { useForm } from '@mantine/form';
// import FaceScanner from '../../components/FaceScanner';
// import { SinIn } from '../shared/services/auth.service';
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
            <Container my="md">
                <Grid>
                    <Grid.Col span={{ base: 12, xs: 12 }}>
                    <MediaPipe/>
                        {/* <Card
                            shadow="sm"
                            padding="xl"
                            component="a"
                        >
                            <FaceScanner confirmScanAction={signIn} />
                          
                            <Button variant="filled" disabled={signIn} onClick={signInAction}>Sign In</Button>;
                        </Card> */}
                    </Grid.Col>
                </Grid>
            </Container>
            {/* <FaceScanner/> */}

        </>
    );
};

export default SinIn;