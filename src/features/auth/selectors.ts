import { RootState } from '../../services/store/store';

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectIsAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectIsAuthResolved = (state: RootState) =>
  state.auth.authResolved;
export const selectAuthError = (state: RootState) => state.auth.error;
