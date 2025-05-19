
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => {},
  forgotPassword: () => Promise.resolve(),
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao iniciar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('flowbot_token');
        if (!storedToken) {
          throw new Error('No token found');
        }

        // Configurar o token nos cabeçalhos para as requisições
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Buscar informações do usuário
        const response = await axios.get('/api/auth/me');
        
        if (response.data && response.data.user) {
          setUser(response.data.user);
          setToken(storedToken);
          console.log("Usuário autenticado:", response.data.user.email);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        // Remover token inválido
        localStorage.removeItem('flowbot_token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      const { user, token } = response.data;
      
      // Salvar token e configurar cabeçalhos
      localStorage.setItem('flowbot_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      
      return response.data;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      
      const { user, token } = response.data;
      
      // Salvar token e configurar cabeçalhos
      localStorage.setItem('flowbot_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      setToken(token);
      
      return response.data;
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    // Remover token e limpar cabeçalhos
    localStorage.removeItem('flowbot_token');
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setToken(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error("Erro no esqueci senha:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    forgotPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
