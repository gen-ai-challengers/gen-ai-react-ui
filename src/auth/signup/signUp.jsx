import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// import FaceScanner from '../../components/FaceScanner';
// import { signUp } from '../shared/services/auth.service';
import { useSelector, useDispatch } from 'react-redux';
import { signUpSuccess, selectUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LockIcon from '@mui/icons-material/Lock';
import Person2Icon from '@mui/icons-material/Person2';
import InputAdornment from '@mui/material/InputAdornment';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
const SignUp = () => {
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const validate = () => {
    let newErrors = {};

    // if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    // }

    // if (!formData.password || formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters long';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
      debugger;
    if (validate()) {
      // Submit form data (e.g., send to server)
      console.log('Form submitted successfully!', formData);
      const body = {
                phone: formData.name,
                name: formData.name,
                password: formData.password
            }
           try {
          const result = axios.post(process.env.REACT_APP_API_URL + '/register/', body)
              .then(function (response) {
                  // handle success
                  console.log(response);
                  if (response.data.user) {
                      dispatch(signUpSuccess(response.data.user));
                      console.log(userData);
                      navigate('/face-scan');
                  }
              })
              .catch(function (error) {
                  // handle error
                  console.log(error);
              })
              .finally(function () {
                  // always executed
              });
      }
      catch (e) {
          console.log("error!")
      }
      setFormData({ name: '', password: '',phone: '' });
      setErrors({});
    }
  };


  // const submitAction = async (formData: any) => {
  // const handleSubmit = async (values: typeof form.values) => {
  //     const body = {
  //         email: values.email,
  //         name: values.name,
  //         password: values.password
  //     }
  //     try {
  //         const result: any = axios.post(process.env.REACT_APP_API_URL + '/register/', body)
  //             .then(function (response: any) {
  //                 // handle success
  //                 console.log(response);
  //                 if (response.data.user) {
  //                     debugger;
  //                     dispatch(signUpSuccess(response.data.user));
  //                     console.log(userData);
  //                     navigate('/face-scan');
  //                 }
  //             })
  //             .catch(function (error) {
  //                 // handle error
  //                 console.log(error);
  //             })
  //             .finally(function () {
  //                 // always executed
  //             });
  //     }
  //     catch (e) {
  //         console.log("error!")
  //     }

  //     // Replace '/new-url' with the actual URL

  // }
  return (
    <>

      <form onSubmit={handleSubmit}>
        <Box sx={{ width:'100%', display: 'flex' }}>
          <Box sx={{ p: 2, textAlign: 'center', display: 'flex',paddingTop:'125px' }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>

                <TextField
                fullWidth
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="standard"
                  startAdornment={
                    <InputAdornment position="start">
                    <Person2Icon/>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  variant="standard"
                  startAdornment={
                    <InputAdornment position="start">
                  <LocalPhoneIcon/>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="standard"
                  startAdornment={
                    <InputAdornment position="start">
                      <LockIcon/>
                    </InputAdornment>
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" color="success" variant="contained" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default SignUp;