import { useReducer, useEffect } from 'react';
import { CartContext } from './CartContext';

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant } = action;
      const price = variant
        ? +(product.price * variant.multiplier * (1 - (variant.discountPct ?? 0) / 100)).toFixed(2)
        : product.price;
      const existing = state.find(i => i.id === product.id);
      if (existing) {
        return state.map(i =>
          i.id === product.id
            ? { ...i, price, variant: variant ?? null, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...state, { ...product, price, variant: variant ?? null, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QTY':
      if (action.qty <= 0) return state.filter(i => i.id !== action.id);
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.qty } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

function getInitialCart() {
  try {
    const saved = localStorage.getItem('hanook-cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], getInitialCart);

  useEffect(() => {
    localStorage.setItem('hanook-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant = null) => dispatch({ type: 'ADD_ITEM', product, variant });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}
