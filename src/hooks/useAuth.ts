import { useAppSelector } from './useRedux';

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  return auth;
};
