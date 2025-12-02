import React, { createContext, useContext, useState, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Configure Amplify with Cognito settings
// IMPORTANT: Replace these values with your actual Cognito User Pool details from AWS Console
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    }
  }
};

// Only configure Amplify if not in demo mode
const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
if (!isDemoMode) {
  Amplify.configure(amplifyConfig);
}

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      if (isDemoMode) {
        // Demo mode: check localStorage for mock user
        const mockUser = localStorage.getItem('user');
        if (mockUser) {
          setUser(JSON.parse(mockUser));
        }
      } else {
        // Real Amplify auth
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        
        setUser({
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId || currentUser.username,
        });
        
        // Store token for API calls
        const token = session.tokens?.idToken?.toString();
        if (token) {
          localStorage.setItem('authToken', token);
        }
      }
    } catch (err) {
      console.log('No authenticated user', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setError(null);
    setLoading(true);

    try {
      if (isDemoMode) {
        // Demo mode: mock login
        const mockUser = {
          username: username,
          email: `${username}@demo.com`,
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.setItem('authToken', 'demo-token-' + Date.now());
        setUser(mockUser);
        return { success: true };
      } else {
        // Real Amplify login
        const { isSignedIn } = await signIn({ username, password });
        
        if (isSignedIn) {
          await checkUser();
          return { success: true };
        }
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isDemoMode) {
        // Demo mode: clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } else {
        // Real Amplify logout
        await signOut();
        localStorage.removeItem('authToken');
      }
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
