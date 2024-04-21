import React from 'react';
import { BrowserRouter, createBrowserRouter,RouterProvider } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignUp from '../auth/signup/signUp';
import WebcamDemo1 from '../components/FaceScanner';
import AddFace from "../auth/signup/addFace";
import SignIn from "../auth/signIn/signIn";
import ModelTrainer from "../auth/trainer/ModelTrainer";
import DefaultLayout from "../layout/default/DefaultLayout";
import Checkout from "../checkout/Checkout";
import SignUpLayout from '../auth/signup/signUpLayout';
import AntMedia from '../components/antmedia/AntMedia';
// import Contact from './components/Contact';
// import NotFound from './components/NotFound';
const router = createBrowserRouter([
  { path: '/sign-up', element: <SignUpLayout /> },
  { path: '/ant-media', element: <AntMedia /> },
  {
    path: '/',
    element: <DefaultLayout />, // Wrap root path with Layout
    children: [
      { path: '/', element: <SignIn /> },
      { path: '/add-face', element: <AddFace /> },
      // { path: '/about', element: <ModelTrainer /> },
      // Add more child routes here
    ],
  },
  { path: '/checkout', element: <Checkout /> },
]);
const AppRoutes = () => {
  return (
      <RouterProvider router={router} />
  );
}

export default AppRoutes;
