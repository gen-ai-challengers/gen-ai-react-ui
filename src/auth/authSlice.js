import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Use createSlice if using toolkit

const initialState = {
  count: 0,
  isLoggedIn: false,
  user: null,
  error: null, // Optional: Add error state for login failures
  isSignUpClicked: false,
  isSignUp: false,
  registrationForm: {},
  isOtpSuccuss: false,
  isFaceAdded: false,
  signUpError: null, // Optional: Add error state for signup failures
  faceAddError: null, // Optional: Add error state for faceadd failures
  faceRecognitionConfirm:false
};
// Simulate an asynchronous authentication check (replace with your actual logic)
export const checkAuthentication = createAsyncThunk(
  'user/checkAuthentication',
  async () => {
    // Replace with your authentication logic (e.g., checking token in localStorage)
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }
);
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
    loginError(state, action) { // Optional: Handle login errors
      state.error = action.payload;
    },
    signUpClicked(state, action) {
      console.log(action)
      state.isSignUpClicked = action.payload;
    },
    signUpSuccess(state, action) {
      state.isSignUp = true;
      state.isOtpSuccuss = true;
      // state.registrationForm = action.payload;
      state.user = action.payload;
    },
    setFaceRecognitionConfirm(state,action){
      state.faceRecognitionConfirm=action.payload;
    },
    otpSuccess(state, action) {
      state.isOtpSuccuss = true;
      state.user = action.payload;
    },
    faceAddSuccess(state, action) {
      state.isSignUp = false;
      state.isOtpSuccuss = false;
      state.isFaceAdded = true;
    },
    signUpError(state, action) { // Optional: Handle signup errors
      state.signUpError = action.payload;
      state.isSignUp = false;
      state.isOtpSuccuss = false;
      state.isSignUpClicked = false;
    },
    faceAddError(state, action) { // Optional: Handle face add errors
      state.faceAddError = action.payload;
    },
  },
});

export const { loginSuccess, signUpSuccess,signUpError, faceAddError, signUpClicked,faceRecognitionConfirm,faceAddSuccess } = authSlice.actions
export const selectUser = (state) => state.auth.user;
export const selectSignUpSuccess = (state) => state.auth.isSignUp;
export const SignUpClicked = (state) => state.auth.isSignUpClicked;
export const getFaceRecognitionConfirm = (state) =>state.auth.faceRecognitionConfirm;
export default authSlice.reducer;