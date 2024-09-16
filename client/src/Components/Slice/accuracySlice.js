// accuracySlice.js
import { createSlice } from '@reduxjs/toolkit';

const accuracySlice = createSlice({
  name: 'accuracy',
  initialState: {
    score: null,
    showConfetti: false,
    showError: false,
  },
  reducers: {
    setAccuracyScore: (state, action) => {
      state.score = action.payload;
      state.showConfetti = true; // Show confetti when score is set
    },
    resetConfetti: (state) => {
      state.showConfetti = false;
      state.score = null;
    },
    triggerError: (state) => {
      state.showError = true;
      state.showConfetti = false;
    },
    resetError: (state) => {
      state.showError = false;
    },
  },
});

export const { setAccuracyScore, resetConfetti, triggerError, resetError } = accuracySlice.actions;
export default accuracySlice.reducer;
