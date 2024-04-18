import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Use createSlice if using toolkit

const initialState = {
    count:0,
    trainedModel:{},
    blankFrame:{}
};
const trainerSlice = createSlice({
  name: 'trainer',
  initialState,
  reducers: {
    addToTrainer(state, action) {
      if(!state.trainedModel[action.payload.key]){
      state.trainedModel[action.payload.key]=action.payload.value;
      }
      console.log(action)
    },
    clearModel(state,action){
      state.trainedModel=[];
    }
  },
});

export const { addToTrainer,clearModel } = trainerSlice.actions
export const selectModel = (state) => state.trainer.trainedModel;

export default trainerSlice.reducer;