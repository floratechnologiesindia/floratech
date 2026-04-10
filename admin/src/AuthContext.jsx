import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('flora_admin_token'));

  const value = useMemo(
    () => ({
      token,
      login(newToken) {
        if (newToken == null || String(newToken).trim() === '') return;
        const t = String(newToken).trim();
        localStorage.setItem('flora_admin_token', t);
        setToken(t);
      },
      logout() {
        localStorage.removeItem('flora_admin_token');
        setToken(null);
      },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
