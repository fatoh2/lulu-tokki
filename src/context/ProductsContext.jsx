import { createContext, useContext, useState, useCallback } from 'react';
import baseProducts from '../data/products.json';

const ProductsContext = createContext(null);

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ProductsProvider({ children }) {
  const [added, setAdded] = useState(() => load('hanook_added', []));
  const [removedIds, setRemovedIds] = useState(() => load('hanook_removed', []));

  const products = [
    ...baseProducts.filter(p => !removedIds.includes(p.id)),
    ...added.filter(p => !removedIds.includes(p.id)),
  ];

  const addProduct = useCallback((data) => {
    setAdded(prev => {
      const maxId = Math.max(
        ...baseProducts.map(p => p.id),
        ...prev.map(p => p.id),
        100
      );
      const next = [...prev, {
        ...data,
        id: maxId + 1,
        origin: 'كوريا الجنوبية',
        isNew: true,
        isFeatured: false,
        rating: 0,
        reviews: 0,
        longDescription: data.description,
        tags: data.tags ?? [],
      }];
      save('hanook_added', next);
      return next;
    });
  }, []);

  const removeProduct = useCallback((id) => {
    setRemovedIds(prev => {
      const next = [...prev, id];
      save('hanook_removed', next);
      return next;
    });
  }, []);

  const restoreProduct = useCallback((id) => {
    setRemovedIds(prev => {
      const next = prev.filter(rid => rid !== id);
      save('hanook_removed', next);
      return next;
    });
  }, []);

  return (
    <ProductsContext.Provider value={{ products, addProduct, removeProduct, restoreProduct, removedIds }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
