import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('f1Token');
      
      if (token) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          // Token might be expired or invalid
          localStorage.removeItem('f1Token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);
  
  // Login function
  const login = async (token, userData) => {
    localStorage.setItem('f1Token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('f1Token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};