import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('studentos_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const persistSession = (account: User) => {
    setUser(account);
    localStorage.setItem('studentos_user', JSON.stringify(account));
  };

  const loadUsers = (): Array<{ id: string; name: string; email: string; password: string }> => {
    const stored = localStorage.getItem('studentos_users');
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: Array<{ id: string; name: string; email: string; password: string }>) => {
    localStorage.setItem('studentos_users', JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    const users = loadUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) throw new Error('Account not found. Please sign up first.');
    if (existing.password !== password) throw new Error('Incorrect password.');

    const account: User = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + existing.email,
      role: 'student',
      createdAt: new Date(),
    };
    persistSession(account);
  };

  const loginWithGoogle = async () => {
    // Lightweight client-side flow: ask for Google email, create account if missing
    const email = window.prompt('Enter your Google email to sign in');
    if (!email) return;
    const users = loadUsers();
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!existing) {
      existing = {
        id: crypto.randomUUID(),
        name: email.split('@')[0],
        email,
        password: '',
      };
      saveUsers([...users, existing]);
    }

    const account: User = {
      id: existing.id,
      name: existing.name,
      email: existing.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + existing.email,
      role: 'student',
      createdAt: new Date(),
    };
    persistSession(account);
  };

  const signup = async (name: string, email: string, password: string) => {
    const users = loadUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error('Account already exists. Please log in.');

    const record = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
    };
    saveUsers([...users, record]);

    const account: User = {
      id: record.id,
      name: record.name,
      email: record.email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + record.email,
      role: 'student',
      createdAt: new Date(),
    };
    persistSession(account);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studentos_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
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