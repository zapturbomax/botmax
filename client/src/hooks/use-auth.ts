
import { useContext, createContext } from 'react';
import { AuthContextType, User } from '@/lib/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export type { User, AuthContextType };
