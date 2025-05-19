
import { useContext } from 'react';
import { AuthContext, AuthContextType, User } from '@/lib/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export type { User, AuthContextType };
