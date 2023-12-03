import { User, getAuth } from 'firebase/auth';

export function useCurrentUser(): User | null {
  const auth = getAuth();

  return auth?.currentUser;
}
