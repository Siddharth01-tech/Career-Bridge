import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'cb_token';
const USER_KEY = 'cb_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify and refresh current user profile on app load if token exists
  useEffect(() => {
    let isMounted = true;

    async function verifyUser() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await authService.getMe(storedToken);
        if (isMounted && response?.user) {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
      } catch (err) {
        console.warn('Session verification failed or expired:', err.message);
        // Token is invalid or expired
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifyUser();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user with email and password
   */
  const login = useCallback(async ({ email, password, rememberMe = true }) => {
    const data = await authService.login({ email, password });
    const receivedToken = data.token;
    const receivedUser = data.user;

    setToken(receivedToken);
    setUser(receivedUser);

    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
    } else {
      // Still set for active session
      localStorage.setItem(TOKEN_KEY, receivedToken);
      localStorage.setItem(USER_KEY, JSON.stringify(receivedUser));
    }

    return { user: receivedUser, token: receivedToken };
  }, []);

  /**
   * Register new user account and automatically sign them in
   */
  const register = useCallback(async ({ name, email, password, role = 'candidate' }) => {
    // 1. Call Register API
    const data = await authService.register({ name, email, password, role });
    const registeredUser = data.user;

    // 2. Automatically log in to get session token & active state
    try {
      const loginData = await authService.login({ email, password });
      setToken(loginData.token);
      setUser(loginData.user);
      localStorage.setItem(TOKEN_KEY, loginData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));
      return { user: loginData.user, token: loginData.token, autoLoggedIn: true };
    } catch {
      // In case auto-login fails, return the registered user info
      return { user: registeredUser, autoLoggedIn: false };
    }
  }, []);

  /**
   * Log out user
   */
  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout(token);
      }
    } catch (err) {
      console.warn('Error during logout:', err.message);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }, [token]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
