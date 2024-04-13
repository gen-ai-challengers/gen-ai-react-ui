import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Use createSlice if using toolkit

const initialState = {
  count:0,
  isLoggedIn: false,
  user: null,
  error: null, // Optional: Add error state for login failures
  isSignUp: false,
  isFaceAdded: false,
  signUpError: null, // Optional: Add error state for signup failures
  faceAddError: null, // Optional: Add error state for faceadd failures

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
    signUpSuccess(state, action) {
      state.isSignUp = true;
      state.user = action.payload;
    },
    faceAddSuccess(state, action) {
      state.faceAddSuccess = true;
    },
    signUpError(state, action) { // Optional: Handle signup errors
      state.signUpError = action.payload;
    },
    faceAddError(state, action) { // Optional: Handle face add errors
      state.faceAddError = action.payload;
    },
  },
});

export const { loginSuccess, signUpSuccess, faceAddError } = authSlice.actions
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;