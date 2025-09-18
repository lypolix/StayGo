import { type ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from './api';
import { setCredentials, logout } from './authSlice';
import { type AppDispatch, type RootState } from '@/app/store';
import { getAccessToken } from '@/utils/auth';

type AuthProviderProps = { children: ReactNode };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (accessToken) {
      dispatch(setCredentials({ token: accessToken }));
    } else {
      dispatch(logout());
    }
  }, [dispatch]);

  const hasToken = !!(token ?? getAccessToken());
  const { data: me, isFetching } = useGetMeQuery(undefined, {
    skip: !hasToken,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (me && (!user || user.email !== me.email)) {
      dispatch(setCredentials({ user: me }));
    }
  }, [me, user, dispatch]);

  if (hasToken && isFetching && !user) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
