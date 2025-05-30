// AuthContext.js or AuthContext.tsx
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const value = {
    authModalOpen,
    setAuthModalOpen,
    // other auth methods
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
