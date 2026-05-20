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
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        // First run — seed from local JSON
        const batch = writeBatch(db);
        baseProducts.forEach(p => batch.set(doc(db, 'products', String(p.id)), p));
        await batch.commit();
        setProducts([...baseProducts].sort((a, b) => a.id - b.id));
      } else {
        const docs = snap.docs.map(d => d.data()).sort((a, b) => a.id - b.id);
        setProducts(docs);
      }
      setLoading(false);
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

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, removeProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
