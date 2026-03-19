import { PropsWithChildren, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { persistAuthUser } from './authCookies';
import { useAppDispatch } from '../../services/hooks';
import {
  bootstrapAuthAsync,
  sessionExpired,
} from '../../services/store/slices/authSlice';
import { AUTH_SESSION_EXPIRED_EVENT } from './constants';
import { logAuthEvent } from './authLogger';
import { useAuth } from './useAuth';

export function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { authResolved, isLoading, user } = useAuth();
  const bootstrapTriggeredRef = useRef(false);

  useEffect(() => {
    if (authResolved || isLoading || bootstrapTriggeredRef.current) {
      return;
    }

    bootstrapTriggeredRef.current = true;

    logAuthEvent('[AUTH_BOOTSTRAP_START]', {
      path: location.pathname,
      hasReduxUser: Boolean(user),
      authResolved,
    });

    void dispatch(bootstrapAuthAsync());
  }, [authResolved, dispatch, isLoading, location.pathname, user]);

  useEffect(() => {
    if (user) {
      persistAuthUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleSessionExpired = () => {
      dispatch(sessionExpired());
    };

    window.addEventListener(
      AUTH_SESSION_EXPIRED_EVENT,
      handleSessionExpired as EventListener
    );

    return () => {
      window.removeEventListener(
        AUTH_SESSION_EXPIRED_EVENT,
        handleSessionExpired as EventListener
      );
    };
  }, [dispatch]);

  return <>{children}</>;
}
