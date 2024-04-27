import React from 'react';
import { BrowserRouter, createBrowserRouter,RouterProvider } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignUp from '../auth/signup/signUp';
import WebcamDemo1 from '../components/FaceScanner';
import AddFace from "../auth/signup/addFace";
import SignIn from "../auth/signIn/signIn";
import LogIn from "../auth/signIn/logIn";
import ModelTrainer from "../auth/trainer/ModelTrainer";
import DefaultLayout from "../layout/default/DefaultLayout";
import Checkout from "../checkout/Checkout";
import SignUpLayout from '../auth/signup/signUpLayout';
import AntMedia from '../components/antmedia/AntMedia';
import WebRTCVideoChat from '../components/webRtcOld';
import WebRtcAuth from '../components/webRtc';
import CatelogueHome from '../catalogue/catalogueHome';
import MediaPipe1 from '../components/mediaPipe1';
import GenAiChat from '../chat/GenAiChat';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../layout/default/header/ResponsiveAppBar';
// import Contact from './components/Contact';
// import NotFound from './components/NotFound';
const router = createBrowserRouter([
  { path: '/sign-up', element: <SignUpLayout /> },
  { path: '/ant-media', element: <AntMedia /> },
  { path: '/', element: <LogIn /> },  // username password login
  { path: '/sign-in', element: <SignIn /> },  // face Scan login
  {
    path: '/',
    element: <DefaultLayout />, // Wrap root path with Layout
    children: [
      { path: '/home', element: <SignIn /> },
      // { path: '/add-face', element: <AddFace /> },
      // { path: '/about', element: <ModelTrainer /> },
      // Add more child routes here
    ],
  },
  { path: '/catalogue', element: <CatelogueHome /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/mediapipe', element: <MediaPipe1 /> },
  { path: '/webrtc1', element: <WebRtcAuth /> },
  { path: '/gen-ai-chat', element: <GenAiChat /> },
]);
const AppRoutes = () => {
  return (
    <Grid container fluid>
    <Grid item
      xs={12}>
      <Box
      >
      <ResponsiveAppBar />
      </Box>
    </Grid>
    <Grid
      item
      xs={12}
    >
      <Box
        xs={{
          display: 'flex',
          alignItems: 'end',
        }}
      >
      <RouterProvider router={router} />
      </Box>
    </Grid>
    </Grid>
  );
}

export default AppRoutes;
