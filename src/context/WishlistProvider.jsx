import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { WishlistContext } from './WishlistContext';

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let active = true;
    const loadWishlist = async () => {
      if (!user) {
        if (active) setWishlist([]);
        return;
      }
      const snap = await getDoc(doc(db, 'wishlists', user.id));
      if (active) setWishlist(snap.exists() ? snap.data().productIds || [] : []);
    };
    loadWishlist();
    return () => { active = false; };
  }, [user]);

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
