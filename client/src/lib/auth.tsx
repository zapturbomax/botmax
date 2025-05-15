import { createContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { queryClient } from './queryClient';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  role: string;
  planId?: number;
}

interface Tenant {
  id: number;
  userId: number;
  name: string;
  subdomain: string;
}

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateTenant: (data: Partial<Tenant>) => void;
}

// Context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  tenant: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  updateTenant: () => {},
});

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_, setLocation] = useLocation();

  // Load from local storage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedUser = localStorage.getItem('flowbot_user');
        const savedTenant = localStorage.getItem('flowbot_tenant');
        const savedToken = localStorage.getItem('flowbot_token');
        
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          
          if (savedTenant) {
            setTenant(JSON.parse(savedTenant));
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuthState();
  }, []);

  // Login
  const login = (data: any) => {
    if (!data.user || !data.token) {
      console.error('Invalid login data:', data);
      return;
    }
    
    setUser(data.user);
    setToken(data.token);
    
    if (data.tenant) {
      setTenant(data.tenant);
      localStorage.setItem('flowbot_tenant', JSON.stringify(data.tenant));
    }
    
    localStorage.setItem('flowbot_user', JSON.stringify(data.user));
    localStorage.setItem('flowbot_token', data.token);
  };

  // Logout
  const logout = () => {
    setUser(null);
    setTenant(null);
    setToken(null);
    localStorage.removeItem('flowbot_user');
    localStorage.removeItem('flowbot_tenant');
    localStorage.removeItem('flowbot_token');
    queryClient.clear();
    setLocation('/login');
  };

  // Update user
  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('flowbot_user', JSON.stringify(updatedUser));
    }
  };

  // Update tenant
  const updateTenant = (data: Partial<Tenant>) => {
    if (tenant) {
      const updatedTenant = { ...tenant, ...data };
      setTenant(updatedTenant);
      localStorage.setItem('flowbot_tenant', JSON.stringify(updatedTenant));
    }
  };

  const contextValue = {
    user,
    tenant,
    token,
    isLoading,
    login,
    logout,
    updateUser,
    updateTenant
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
