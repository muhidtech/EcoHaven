/**
 * Authentication Context Provider
 * 
 * This file creates a React context for managing authentication state throughout the application.
 * It provides functions for user authentication (sign-in, sign-up, sign-out) and role-based access control.
 * 
 * This implementation uses localStorage for persistence with token expiration for improved security.
 * In a production environment, consider using HTTP-only cookies and server-side session management.
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback, useMemo } from 'react';


// Define user roles type
type UserRole = 'user' | 'admin' | 'guest';

// Define authentication status type
type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

// Custom error types for better error handling
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ExpiredSessionError extends AuthError {
  constructor(message: string = 'Your session has expired. Please sign in again.') {
    super(message);
    this.name = 'ExpiredSessionError';
  }
}

// Define the shape of our user data
interface User {
    uid: string;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    expiresAt: number;
    refreshToken?: string;
  }

// Define the shape of our auth context
interface AuthContextType {
    user: User | null;
    loading: boolean;
    authStatus: AuthStatus;
    authError: string | null;
    isLoggedIn: boolean,
    isAdminLogin: () => boolean,
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string, firstName: string, lastName: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: () => boolean;
    refreshSession: () => Promise<void>;
    hasPermission: (requiredRole: UserRole) => boolean;
    clearAuthError: () => void;
  }

// Create the auth context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
  sessionDuration?: number; // Duration in milliseconds
}

// Constants for authentication
const LOCAL_STORAGE_KEY = 'ecoHavenUser';
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_REFRESH_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds

// AuthProvider component that wraps the application
export const AuthProvider = ({ 
  children, 
  sessionDuration: customSessionDuration = DEFAULT_SESSION_DURATION 
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const userRef = useRef<User | null>(null);



  
  // Clear authentication errors
  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Load user data from localStorage on initial render and check for expiration
  useEffect(() => {
    const loadUserFromStorage = () => {
      setAuthStatus('authenticating');
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!storedUser) {
        setLoading(false);
        setAuthStatus('idle');
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser) as User;
        
        // Validate the parsed user object has required fields
        if (!parsedUser || !parsedUser.uid || !parsedUser.email || !parsedUser.role || !parsedUser.expiresAt) {
          throw new Error('Invalid user data format');
        }

        // Check if the session has expired
        if (parsedUser.expiresAt < Date.now()) {
          console.log('User session expired, logging out');
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setUser(null);
          userRef.current = null;
          setAuthStatus('idle');
          setIsLoggedIn(false);
        } else {
          // If session is close to expiring but still valid, refresh it
          if (parsedUser.expiresAt - Date.now() < SESSION_REFRESH_THRESHOLD) {
            console.log('Session close to expiry, refreshing');
            parsedUser.expiresAt = Date.now() + customSessionDuration;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedUser));
          }
          setUser(parsedUser);
          userRef.current = parsedUser;
          setAuthStatus('authenticated');
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setAuthStatus('error');
        setAuthError('Session data corrupted. Please sign in again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();

    // Set up interval to periodically check session expiration
    const intervalId = setInterval(() => {
      if (userRef.current && userRef.current.expiresAt < Date.now()) {
        console.log('Session expired during active use');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setUser(null);
        userRef.current = null;
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [customSessionDuration]);

  /**
   * Sign in a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise resolving to User object
   * 
   * In a real application, this would validate credentials against a backend.
   * For this simplified version, we're checking against hardcoded admin credentials
   * and some basic validation.
   */

  const signIn = useCallback( async (identifier: string, password: string): Promise<User> => {
    try {
      setAuthStatus('authenticating');
      setAuthError(null);
  
      // Check for admin credentials
      const isAdminCredentials = identifier === 'admin' && password === 'admin';
  
      // Input validation (for non-admin users)
      if (!isAdminCredentials) {
        if (!identifier || !identifier.trim()) {
          throw new ValidationError('Username or email is required');
        }
        if (!password) {
          throw new ValidationError('Password is required');
        }
  
        // Determine if identifier is an email or a username
        const isEmail = identifier.includes('@');
  
        if (isEmail) {
          // Validate email format
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(identifier.trim())) {
            throw new ValidationError('Invalid email format');
          }
        } else {
          // Validate username (alphanumeric, underscores, 3-20 characters)
          const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
          if (!usernameRegex.test(identifier.trim())) {
            throw new ValidationError('Invalid username format');
          }
        }
  
        if (password.length < 8) {
          throw new ValidationError('Password must be at least 8 characters');
        }
      }
  
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      console.log('Making a get request');
  
      // API call to retrieve user account using a GET request with query params
      // For admin login, we'll still make the request but ignore the response
      const response = await fetch(
        `/api/users?identifier=${encodeURIComponent(identifier)}&password=${encodeURIComponent(password)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!isAdminCredentials && !response.ok) {
        const errorData = await response.json();
        throw new ValidationError(errorData.error || 'Failed to sign in');
      }
  
      const data = await response.json();
  
      // If admin credentials, override with admin info
      // This creates a hardcoded admin user with full admin privileges
      const loggedUser: User = isAdminCredentials
        ? {
            uid: 'admin',
            email: 'admin@ecohaven.com',
            firstName: 'Admin',
            lastName: '',
            displayName: 'admin',
            role: 'admin',
            expiresAt: Date.now() + customSessionDuration,
            refreshToken: Math.random().toString(36).substring(2, 15),
          }
        : {
            uid: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            displayName: data.user.username,
            role: 'user',
            expiresAt: Date.now() + customSessionDuration,
            refreshToken: Math.random().toString(36).substring(2, 15),
          };
  
      // Store user data in localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loggedUser));
        setUser(loggedUser);
        userRef.current = loggedUser;
      } catch (storageError) {
        console.error('Error storing user data:', storageError);
        setIsLoggedIn(false);
        throw new AuthError('Failed to save session data. Please try again.');
      }
  
      setAuthStatus('authenticated');
      setIsLoggedIn(true);
  
      return loggedUser;
    } catch (error) {
      console.error('Sign in error:', error instanceof Error ? error.message : 'Unknown error');
      setAuthStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      setAuthError(errorMessage);
      setIsLoggedIn(false);
      throw new AuthError(errorMessage);
    }
  }, [customSessionDuration]);
  
  

  /**
   * Create a new user account
   * @param email - User's email address
   * @param password - User's password
   * @param displayName - User's display name
   * @returns Promise that resolves when sign up is complete
   * 
   * This sends a POST request to the API endpoint to store the user
   * and also maintains the session in localStorage.
   */
  const signUp = useCallback( async (email: string, password: string, firstName: string, lastName: string, displayName: string): Promise<void> => {
    try {
      setAuthStatus('authenticating');
      setAuthError(null);
           
      // Email format validation - more comprehensive regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.trim())) {
        throw new ValidationError('Invalid email format');
      }
      
      // Password strength validation
      if (password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }
      
      // Check for at least one number and one letter for stronger passwords
      const hasNumber = /\d/.test(password);
      const hasLetter = /[a-zA-Z]/.test(password);
      
      if (!hasNumber || !hasLetter) {
        throw new ValidationError('Password must contain at least one letter and one number');
      }
      
      // Display name validation
      if (displayName.trim().length < 2) {
        throw new ValidationError('Display name must be at least 2 characters');
      }
      if (firstName.trim().length < 2) {
        throw new ValidationError('First name must be at least 2 characters long');
      }

      if (lastName.trim().length < 2) {
        throw new ValidationError('Last name must be at least 2 characters long');
      }
      
      // Create user data for API request
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: displayName.trim(),
        email: email.trim(),
        role: 'user',
        password: password // In a real app, you'd hash this on the server
      };
      
      // Send POST request to API endpoint
      try {
        console.log("Sending user data to API:", userData);

        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (!response.ok) {
          const errorData = await response.json();
          throw new ValidationError(errorData.error || 'Failed to create user account');
        }
        
        
        // Generate a unique ID with more entropy if not provided by API
        const uid = data.user?.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        
        // Create a refresh token (in a real app, this would come from the server)
        const refreshToken = Math.random().toString(36).substring(2, 15) + 
                             Math.random().toString(36).substring(2, 15);
        
        // Create a new user object with expiration
        const newUser: User = {
            uid,
            email,
            displayName,
            firstName,
            lastName,
            role: 'user',
            expiresAt: Date.now() + customSessionDuration,
            refreshToken
          };
    
        
        try {
          // Store in localStorage
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newUser));
          
          // Update state
          setUser(newUser);
          userRef.current = newUser;
        } catch (storageError) {
          console.error('Error storing user data:', storageError);
          throw new AuthError('Failed to save session data. Please try again.');
        }
        setAuthStatus('authenticated');
      } catch (apiError) {
        console.error('API error during sign up:', apiError);
        throw apiError instanceof Error 
          ? apiError 
          : new AuthError('Failed to create user account. Please try again.');
      }
    } catch (error) {
      console.error('Error during sign up:', error instanceof Error ? error.message : 'Unknown error');
      
      setAuthStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      setAuthError(errorMessage);
      
      // Rethrow the error if it's already one of our custom types
      if (error instanceof AuthError) {
        throw error;
      }
      
      // Otherwise wrap it in an AuthError
      throw new AuthError(errorMessage);
    }
    
  }, [customSessionDuration]);

  /**
   * Sign out the current user
   * @returns Promise that resolves when sign out is complete
   * 
   * Removes the user data from localStorage and updates state.
   */
  const signOut = useCallback( async (): Promise<void> => {
    try {
      setAuthStatus('authenticating');
      setAuthError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Remove from localStorage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      // Update state
      setUser(null);
      userRef.current = null;
      setAuthStatus('idle');
      setIsLoggedIn(false)
    } catch (error) {
      console.error('Error during sign out:', error instanceof Error ? error.message : 'Unknown error');
      
      setAuthStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      setAuthError(errorMessage);
      
      throw new AuthError('Failed to sign out. Please try again.');
    }
  }, [customSessionDuration]);

  /**
   * Refresh the user session by extending the expiration time
   * @returns Promise that resolves when the session is refreshed
   */
  const refreshSession = async (): Promise<void> => {
    try {
      setAuthError(null);
      
      if (!user) {
        throw new AuthError('No active user session to refresh');
      }
      
      // In a real app, this would validate the refresh token with the server
      if (!user.refreshToken) {
        throw new AuthError('No refresh token available');
      }
      
      // Extend the session
      const updatedUser: User = {
        ...user,
        expiresAt: Date.now() + customSessionDuration
      };
      
      try {
        // Update localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        userRef.current = updatedUser;
      } catch (storageError) {
        console.error('Error storing updated session:', storageError);
        throw new AuthError('Failed to refresh session. Please try again.');
      }
    } catch (error) {
      console.error('Error refreshing session:', error instanceof Error ? error.message : 'Unknown error');
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh session';
      setAuthError(errorMessage);
      
      // If it's a serious error, sign the user out
      if (!(error instanceof ValidationError)) {
        try {
          await signOut();
        } catch (signOutError) {
          console.error('Error during forced sign out:', signOutError);
        }
      }
      
      // Rethrow the error
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(errorMessage);
    }
  };

  /**
   * Check if the current user has admin role
   * @returns boolean indicating whether the user is an admin
   */
  const isAdmin = useCallback((): boolean => {
    // Check if user exists, has a role property, and the role is 'admin'
    // This function is used to verify admin privileges throughout the application
    return Boolean(user?.role === 'admin');
  }, [user]);

  /**
   * Alias for isAdmin function
   * @returns boolean indicating whether the user is an admin
   */
  const isAdminLogin = useCallback((): boolean => {
    return isAdmin();
  }, [isAdmin]);

  
  /**
   * Check if the current user has the required role
   * @param requiredRole - The role required for access
   * @returns boolean indicating whether the user has the required role
   */
  const hasPermission = useCallback((requiredRole: UserRole): boolean => {
    if (!user) return requiredRole === 'guest'; // Only allow guest access if no user
    
    // Admin has access to everything - this ensures admin can access all protected routes
    if (user.role === 'admin') return true;
    
    // For regular users, check if they have the specific required role
    return user.role === requiredRole;
  }, [user]);

  // Value object to be provided to consumers of the context
  const value: AuthContextType = useMemo(() => {
    return {
      user,
      loading,
      authStatus,
      authError,
      isLoggedIn,
      isAdminLogin,
      signIn,
      signUp,
      signOut,
      isAdmin,
      refreshSession,
      hasPermission,
      clearAuthError,
    };
  }, [
    user,
    loading,
    authStatus,
    authError,
    isLoggedIn,
    isAdminLogin,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshSession,
    hasPermission,
    clearAuthError,
  ]);
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
