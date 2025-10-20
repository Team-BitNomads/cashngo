/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Type Imports ---
import type { UserProfile } from '@/types'; // Assuming UserProfile is in your types file

// Define the shape of our authentication context
interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, userData: UserProfile) => void;
  logout: () => void;
  isLoading: boolean;
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // To handle initial auth check
  const navigate = useNavigate();

  // On initial load, check if a token exists in localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: UserProfile & { onboardingComplete?: boolean }) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('authUser', JSON.stringify(userData));

    // CRITICAL FIX: Check if onboarding is complete
    if (userData.onboardingComplete) {
      // If complete, go directly to the dashboard
      navigate('/dashboard');
    } else {
      // If not complete (or flag is missing), go to onboarding
      navigate('/onboarding');
    }
};

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

