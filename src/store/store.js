import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../auth/authSlice";
import trainerReducer from "../auth/trainer/trainerSlice";
export default configureStore({
  reducer: {
    auth:authReducer,
    trainer:trainerReducer
  },
})