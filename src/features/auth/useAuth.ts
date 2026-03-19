import { useAppSelector } from '../../services/hooks';
import { getDefaultRouteForUser } from './authUtils';
import { selectAuthState } from './selectors';

export function useAuth() {
  const auth = useAppSelector(selectAuthState);

  return {
    ...auth,
    homePath: getDefaultRouteForUser(auth.user),
  };
}
