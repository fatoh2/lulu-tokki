import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const key = user ? `hanook-wishlist-${user.id}` : null;

  const [wishlist, setWishlist] = useState(() => {
    if (!key) return [];
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    if (key) {
      try { setWishlist(JSON.parse(localStorage.getItem(key) || '[]')); } catch { setWishlist([]); }
    } else {
      setWishlist([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (key) localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, key]);

  const toggleWishlist = (productId) => {
    if (!user) return false;
    setWishlist(w => w.includes(productId) ? w.filter(id => id !== productId) : [...w, productId]);
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
