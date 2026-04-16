import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('user');

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: saved ? JSON.parse(saved) : null,
    token: localStorage.getItem('token'),
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = slice.actions;
export default slice.reducer;
