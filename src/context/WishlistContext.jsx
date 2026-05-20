import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) { setWishlist([]); return; }
    getDoc(doc(db, 'wishlists', user.id)).then(snap => {
      setWishlist(snap.exists() ? snap.data().productIds || [] : []);
    });
  }, [user?.id]);

  const save = (list, uid) =>
    setDoc(doc(db, 'wishlists', uid), { productIds: list });

  const toggleWishlist = (productId) => {
    if (!user) return false;
    setWishlist(prev => {
      const next = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      save(next, user.id);
      return next;
    });
    return true;
  };

  const inWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, inWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
