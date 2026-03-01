import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthTokens, LoginFormData } from '../../types';
// authService is exported from services/api/index.ts -- adjust relative path accordingly
import { authService } from '../../api';

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de connexion'
      );
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de la récupération de l\'utilisateur'
      );
    }
  }
);

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const tokens = authService.getStoredTokens();
      if (!tokens) {
        return null;
      }
      
      const user = await authService.getCurrentUser();
      return { user, tokens };
    } catch (error: any) {
      authService.logout();
      return rejectWithValue('Session expirée');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.tokens = {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
        };
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Get current user
    builder
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Initialize auth
    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.tokens = action.payload.tokens;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuthAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
