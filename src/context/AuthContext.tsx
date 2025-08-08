import React, { createContext, useContext, useEffect, useState } from 'react';

// Backend user interface
interface BackendUser {
  uid: string;
  phoneNumber: string;
  username: string;
  isPhoneVerified: boolean;
}

interface AuthContextType {
  user: BackendUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (userData: BackendUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser) as BackendUser;
        console.log('🔐 Found stored user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData: BackendUser) => {
    try {
      console.log('🔐 Logging in user:', userData);
      setUser(userData);
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      // Clear user data from localStorage
      localStorage.removeItem('user');
      console.log('🔐 User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    logout,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 