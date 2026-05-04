import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'loading',
  },
  reducers: {
    setAuthLoading(state) {
      state.status = 'loading';
    },
    setCredentials(state, { payload }) {
      state.user = payload.user;
      state.status = 'authenticated';
    },
    clearAuth(state) {
      state.user = null;
      state.status = 'anonymous';
    },
  },
});

export const { setAuthLoading, setCredentials, clearAuth } = slice.actions;
export default slice.reducer;
