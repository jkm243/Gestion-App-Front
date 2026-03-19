import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { logAuthEvent } from '../../../features/auth/authLogger';
import { AuthState, LoginFormData } from '../../../types';
import { authService } from '../../api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  authResolved: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erreur de connexion'
      );
    }
  }
);

export const bootstrapAuthAsync = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      if (!authService.canRestoreSession()) {
        return null;
      }

      const user = await authService.restoreSession();

      logAuthEvent('[AUTH_SESSION_RESTORE_SUCCESS]', {
        userId: user.id,
        isAuthenticated: true,
      });

      return user;
    } catch (error) {
      authService.clearSession();
      const reason =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Session introuvable ou expirée';

      logAuthEvent(
        '[AUTH_SESSION_RESTORE_FAILED]',
        {
          reason,
          isAuthenticated: false,
        },
        'warn'
      );

      return rejectWithValue(reason);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();

      logAuthEvent('[AUTH_LOGOUT]', {
        userId: null,
        cookieCleared: true,
      });

      return null;
    } catch (error) {
      authService.clearSession();

      return rejectWithValue(
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Erreur lors de la déconnexion'
      );
    }
  }
);

export const initializeAuthAsync = bootstrapAuthAsync;

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionExpired(state) {
      authService.clearSession();
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.authResolved = true;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authResolved = true;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.authResolved = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(bootstrapAuthAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bootstrapAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.authResolved = true;
        state.user = action.payload;
        state.isAuthenticated = Boolean(action.payload);
        state.error = null;
      })
      .addCase(bootstrapAuthAsync.rejected, (state) => {
        state.isLoading = false;
        state.authResolved = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authResolved = true;
        state.error = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.authResolved = true;
        state.error = action.payload as string;
      });
  },
});

export const { sessionExpired, clearError } = authSlice.actions;
export default authSlice.reducer;
