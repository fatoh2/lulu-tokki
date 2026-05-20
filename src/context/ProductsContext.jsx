import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import baseProducts from '../data/products.json';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (snap.empty) {
          // Try to seed — only succeeds when admin is logged in
          try {
            const batch = writeBatch(db);
            baseProducts.forEach(p => batch.set(doc(db, 'products', String(p.id)), p));
            await batch.commit();
          } catch {
            // Not admin yet — fall back to local JSON silently
          }
          setProducts([...baseProducts].sort((a, b) => a.id - b.id));
        } else {
          setProducts(snap.docs.map(d => d.data()).sort((a, b) => a.id - b.id));
        }
      } catch {
        setProducts([...baseProducts].sort((a, b) => a.id - b.id));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addProduct = useCallback(async (data) => {
    const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
    const newId = maxId + 1;
    const product = {
      ...data,
      id: newId,
      origin: 'كوريا الجنوبية',
      isNew: true,
      isFeatured: false,
      rating: 0,
      reviews: 0,
      longDescription: data.description,
      tags: data.tags ?? [],
    };
    await setDoc(doc(db, 'products', String(newId)), product);
    setProducts(prev => [...prev, product]);
    return product;
  }, [products]);

  const removeProduct = useCallback(async (id) => {
    await deleteDoc(doc(db, 'products', String(id)));
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProduct = useCallback(async (id, data) => {
    const existing = products.find(p => p.id === id);
    const updated = { ...existing, ...data };
    await setDoc(doc(db, 'products', String(id)), updated);
    setProducts(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  }, [products]);

  const seedProducts = useCallback(async () => {
    const batch = writeBatch(db);
    baseProducts.forEach(p => batch.set(doc(db, 'products', String(p.id)), p));
    await batch.commit();
    setProducts([...baseProducts].sort((a, b) => a.id - b.id));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, removeProduct, updateProduct, seedProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
