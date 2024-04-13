import React from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import SignUp from '../auth/signup/signUp';
import WebcamDemo1 from '../components/WebcamDemo1'; 
import AddFace  from "../auth/signup/addFace";

// import About from './components/About';
// import Contact from './components/Contact';
// import NotFound from './components/NotFound';

const AppRoutes =() =>{
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/face-registration" element={<AddFace />} />
          <Route path="/protected" element={<PrivateRoute />}>
              <Route path="profile" element={<WebcamDemo1 />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
