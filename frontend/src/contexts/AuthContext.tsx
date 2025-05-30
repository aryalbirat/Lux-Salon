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
  openAuthModal: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalRequested: boolean;
  resetAuthModalRequested: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  userRole: 'guest',
  openAuthModal: () => {},
  authModalOpen: false,
  setAuthModalOpen: () => {},
  authModalRequested: false,
  resetAuthModalRequested: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return {
    ...context,
    openAuthModal: () => {
      console.log('Opening login/signup modal');
      context.setAuthModalOpen(true);
    },
  };
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalRequested, setAuthModalRequested] = useState<boolean>(false);
  const notifications = useNotificationService();

  // On mount, check if user is already logged in via localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user'); // Remove invalid user data
        }
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

    console.log('User logged in:', userData);
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

  const openAuthModal = () => {
    console.log('Opening login/signup modal');
    setAuthModalOpen(true);
    setAuthModalRequested(true);
  };
  
  const resetAuthModalRequested = () => {
    setAuthModalRequested(false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated,
        userRole,
        openAuthModal,
        authModalOpen,
        setAuthModalOpen,
        authModalRequested,
        resetAuthModalRequested
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
