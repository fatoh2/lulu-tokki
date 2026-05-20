import { createContext, useContext, useState } from 'react';

const ADMIN_EMAILS = ['fatoh.haj@gmail.com'];
const USERS_KEY = 'hanook-users';
const SESSION_KEY = 'hanook-session';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  });

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find(u => u.email === email.toLowerCase())) return { error: 'emailExists' };
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: btoa(unescape(encodeURIComponent(password))),
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const session = { id: newUser.id, name, email: newUser.email, isAdmin: newUser.isAdmin };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const encoded = btoa(unescape(encodeURIComponent(password)));
    const found = users.find(u => u.email === email.toLowerCase() && u.password === encoded);
    if (!found) return { error: 'invalidCredentials' };
    const session = { id: found.id, name: found.name, email: found.email, isAdmin: ADMIN_EMAILS.includes(found.email) };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
