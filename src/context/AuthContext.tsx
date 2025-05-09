
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  adminLogin: (username: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('faircut-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('faircut-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      // In a real app, we would call our API to send OTP
      // For this demo, we'll simulate it with console log
      console.log(`Sending OTP to ${email}`);
      
      // Here we would make an API call to send OTP via email
      // In a final implementation, we would integrate with a backend service
      
      toast.success(`OTP sent to ${email}`, {
        description: "Please check your email"
      });
      
      // Store email temporarily for OTP verification
      sessionStorage.setItem('faircut-pending-email', email);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to send OTP');
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      // In a real app, we would verify OTP with our backend
      // For this demo, we'll simulate a successful login with any OTP
      console.log(`Verifying OTP: ${otp} for ${email}`);
      
      // Simulate API call success
      const mockUser: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email: email
      };
      
      setUser(mockUser);
      localStorage.setItem('faircut-user', JSON.stringify(mockUser));
      sessionStorage.removeItem('faircut-pending-email');
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('Failed to verify OTP');
      return false;
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      // Hardcoded admin credentials as per requirements
      if (username === 'admin' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin',
          email: 'admin@faircut.com',
          isAdmin: true
        };
        
        setUser(adminUser);
        localStorage.setItem('faircut-user', JSON.stringify(adminUser));
        
        toast.success('Admin login successful!');
        return true;
      } else {
        toast.error('Invalid admin credentials');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error('Admin login failed');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('faircut-user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    verifyOtp,
    logout,
    adminLogin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
