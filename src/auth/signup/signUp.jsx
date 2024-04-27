import React, { useEffect, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { signUpSuccess,signUpError, selectUser,SignUpClicked,signUpClicked } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LockIcon from '@mui/icons-material/Lock';
import Person2Icon from '@mui/icons-material/Person2';
import InputAdornment from '@mui/material/InputAdornment';
const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function SignUp(onSignUp) {
  const navigate = useNavigate();
  const userData = useSelector(selectUser);
  const signUpTriggered=useSelector(SignUpClicked);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    addrl1: '',
    addrl2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });
  useEffect(() => {
    console.log(signUpTriggered);
    if(signUpTriggered){
      handleSubmit();
    }
  },[signUpTriggered]);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    validate();
    setFormData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData)
  };

  const validate = () => {
    let newErrors = {};

    // if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email address';
    // }
    if (!formData.phone || formData.phone < 10) {
      newErrors.phone = 'Phone number required';
    }
    if (!formData.name || formData.password.name < 3) {
      newErrors.name = 'User name required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    // dispatch(signUpClicked(false));
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = () => {
      console.log(validate());
    if (validate()) {
      // Submit form data (e.g., send to server)
      console.log('Form submitted successfully!', formData);
      // dispatch(signUpSuccess({id:1}));
      const body = {
                phone: formData.phone,
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
                      setFormData({ name: '', password: '',phone: '' });
                      // navigate('/add-face');
                  }
              })
              .catch(function (error) {
                console.log(error)
                dispatch(signUpError(true))
                 let newErrors={};
                 if(error && error.response && error.response.data){
                  newErrors.phone = error.response.data.message;
                 }

                 setErrors(newErrors);
              })
              .finally(function () {
                  // always executed
              });
      }
      catch (e) {
        dispatch(signUpError(true))
          console.log("error!")
      }
      setErrors({});
    }
    else{
      dispatch(signUpClicked(false))
    }
  };

  return (
    <form>
    <Grid container spacing={3}>

      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="name"
          type="name"
          error={!!errors.name}
          placeholder="John"
          autoComplete="first name"
          required
          onChange={handleChange}
        />
        <FormHelperText sx={{ color: 'red' }}>{errors.name ? errors.name : ''}</FormHelperText>
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="lastname"
          type="last-name"
          error={!!errors.lastname}
          placeholder="Snow"
          autoComplete="last name"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="addrl1"
          type="address1"
          error={!!errors.addrl1}
          placeholder="Street name and number"
          autoComplete="shipping address-line1"
          required
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="addrl2"
          error={!!errors.addrl2}
          type="address2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          autoComplete="shipping address-line2"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          error={!!errors.city}
          type="city"
          placeholder="New York"
          autoComplete="City"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          error={!!errors.state}
          type="state"
          placeholder="NY"
          autoComplete="State"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          error={!!errors.zip}
          type="zip"
          placeholder="12345"
          autoComplete="shipping postal-code"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          error={!!errors.country}
          type="country"
          placeholder="United States"
          autoComplete="shipping country"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Email
        </FormLabel>
        <OutlinedInput
          id="email"
          name="email"
          error={!!errors.email}
          type="email"
          placeholder="abc@example.com"
          autoComplete="shipping postal-code"
          required
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Phone
        </FormLabel>
        <OutlinedInput
          id="phone"
          name="phone"
          error={!!errors.country}
          type="phone"
          placeholder="Phone"
          autoComplete="shipping country"
          required
          onChange={handleChange}
        />
        <FormHelperText sx={{ color: 'red' }}>{errors.phone ? errors.phone : ''}</FormHelperText>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Password
        </FormLabel>
        <OutlinedInput
          id="password"
          name="password"
          error={!!errors.password}
          helperText={errors.password}
          type="password"
          placeholder="12345"
          autoComplete="shipping postal-code"
          required
          onChange={handleChange}
        />
        <FormHelperText sx={{ color: 'red' }}>{errors.password ? errors.password : ''}</FormHelperText>
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Confirm password
        </FormLabel>
        <OutlinedInput
          id="confirmpassword"
          name="confirmpassword"
          error={!!errors.country}
          type="confirmpassword"
          placeholder="Confirm password"
          autoComplete="shipping country"
          required
        />
      </FormGrid>

    </Grid>      </form>
  );
}
