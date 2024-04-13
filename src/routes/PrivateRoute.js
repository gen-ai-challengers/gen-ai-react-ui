import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { checkAuthentication } from '../auth/authSlice'; // Import the action

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);

  React.useEffect(() => {
    dispatch(checkAuthentication()); // Dispatch the authentication check action
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Handle loading state (optional)
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;