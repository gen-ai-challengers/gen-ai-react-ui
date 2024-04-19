import React from 'react';
import { BrowserRouter, createBrowserRouter,RouterProvider } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignUp from '../auth/signup/signUp';
import WebcamDemo1 from '../components/FaceScanner';
import AddFace from "../auth/signup/addFace";
import SignIn from "../auth/signIn/signIn";
import ModelTrainer from "../auth/trainer/ModelTrainer";
import DefaultLayout from "../layout/default/DefaultLayout";
// import About from './components/About';
// import Contact from './components/Contact';
// import NotFound from './components/NotFound';
const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />, // Wrap root path with Layout
    children: [
      { path: '/', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
      // { path: '/about', element: <ModelTrainer /> },
      // Add more child routes here
    ],
  },
]);
const AppRoutes = () => {
  return (
      <RouterProvider router={router} />
  );
}

export default AppRoutes;
