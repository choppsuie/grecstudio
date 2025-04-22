
import { type User, type Session } from '@supabase/supabase-js';
import { createContext, useContext } from 'react';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isLoggedIn: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
