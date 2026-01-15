import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Role constants matching backend
export const Role = {
  User: 'user',
  Admin: 'admin',
  SuperAdmin: 'superadmin',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

export interface DashboardConfig {
  layout?: string[];
  hiddenCards?: string[];
}

export interface User {
  dashboardConfig?: DashboardConfig;
  id: number;
  name: string;
  email: string;
  role: RoleType;
  profilePicture?: string;
  currency?: string;
  institutionId?: number;
  institutionName?: string;
  isGoogleCalendarConnected?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');

    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const isAdmin = user?.role === Role.Admin || user?.role === Role.SuperAdmin;
  const isSuperAdmin = user?.role === Role.SuperAdmin;
  const isAuthenticated = !!user && !!localStorage.getItem('access_token');

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSuperAdmin, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
