import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

const ADMIN_EMAILS = ['fatoh.haj@gmail.com', 'noorabutamam304@gmail.com'];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser({
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email.split('@')[0],
          email: fbUser.email,
          isAdmin: ADMIN_EMAILS.includes(fbUser.email.toLowerCase()),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (name, email, password) => {
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(fbUser, { displayName: name });
      setUser({
        id: fbUser.uid,
        name,
        email: fbUser.email,
        isAdmin: ADMIN_EMAILS.includes(fbUser.email.toLowerCase()),
      });
      return { success: true };
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') return { error: 'emailExists' };
      return { error: 'unknown' };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch {
      return { error: 'invalidCredentials' };
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
