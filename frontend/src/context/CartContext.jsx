import { createContext, useContext, useReducer, useEffect } from 'react';

const CART_KEY = 'kairamarkt_cart';

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartReducer(state, action) {
  let next;
  switch (action.type) {
    case 'SET':
      next = action.payload;
      break;
    case 'ADD': {
      const payload = action.payload;
      const existing = state.find((i) => i.product?._id === payload.product?._id && (i.cardMessage ?? '') === (payload.cardMessage ?? ''));
      if (existing) {
        next = state.map((i) =>
          i.product?._id === payload.product?._id && (i.cardMessage ?? '') === (payload.cardMessage ?? '')
            ? { ...i, quantity: i.quantity + (payload.quantity || 1) }
            : i
        );
      } else {
        next = [...state, { ...payload, quantity: payload.quantity || 1 }];
      }
      break;
    }
    case 'REMOVE':
      next = state.filter((i) => i.product?._id !== action.payload);
      break;
    case 'UPDATE_QTY':
      next = state.map((i) =>
        i.product?._id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
      );
      break;
    case 'CLEAR':
      next = [];
      break;
    default:
      return state;
  }
  saveCart(next);
  return next;
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], () => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = (product, quantity = 1, options = {}) =>
    dispatch({ type: 'ADD', payload: { product, quantity, cardMessage: options.cardMessage ?? '' } });
  const removeItem = (productId) => dispatch({ type: 'REMOVE', payload: productId });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QTY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const setCart = (list) => dispatch({ type: 'SET', payload: list });

  const subtotal = items.reduce((sum, i) => sum + (i.product?.discountPrice ?? i.product?.price ?? 0) * i.quantity, 0);
  const taxRate = 0.18;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCart,
    subtotal,
    tax,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
