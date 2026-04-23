import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/entities/user/model/types';

interface AuthState {
  user: User | null;
  isLogin: boolean;
}

const initialState: AuthState = {
  user: null,
  isLogin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;