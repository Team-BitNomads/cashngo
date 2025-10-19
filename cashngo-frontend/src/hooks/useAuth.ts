import { useContext } from 'react';
// Import the context from the other file
import { AuthContext } from '../context/AuthContext'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
