import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNotificationService } from '@/services/notifications';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'client' | 'staff' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  userRole: 'guest' | 'client' | 'staff' | 'admin';
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  userRole: 'guest'
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const notifications = useNotificationService();

  // On mount, check if user is already logged in via localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Show welcome notification
    notifications.loginSuccess(userData.name);
  };

  // Logout function
  const logout = () => {
    // Show logout notification before clearing user data
    if (user) {
      notifications.logoutSuccess();
    }
    
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Compute user role
  const userRole = user ? (user.role as 'client' | 'staff' | 'admin') : 'guest';
  
  // Determine if user is authenticated
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        logout, 
        isAuthenticated,
        userRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
