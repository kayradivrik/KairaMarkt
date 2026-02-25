import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from './CartContext';

const FlyToCartContext = createContext(null);

export function FlyToCartProvider({ children }) {
  const cartIconRef = useRef(null);
  const { addItem } = useCart();
  const [flying, setFlying] = useState(null);

  useEffect(() => {
    if (!flying || !cartIconRef.current) return;
    const rect = cartIconRef.current.getBoundingClientRect();
    setFlying((f) => (f ? { ...f, endRect: rect } : null));
  }, [flying?.startRect]);

  const addItemWithFly = useCallback(
    (product, quantity, sourceRect) => {
      if (!sourceRect || !product?.images?.[0]) {
        addItem(product, quantity);
        return;
      }
      setFlying({
        imageUrl: product.images[0],
        startRect: { left: sourceRect.left, top: sourceRect.top, width: sourceRect.width, height: sourceRect.height },
        product,
        quantity,
      });
    },
    [addItem]
  );

  const handleAnimationEnd = useCallback(() => {
    if (flying?.product) {
      addItem(flying.product, flying.quantity);
      setFlying(null);
    }
  }, [flying, addItem]);

  const value = { cartIconRef, addItemWithFly };

  return (
    <FlyToCartContext.Provider value={value}>
      {children}
      {flying &&
        flying.startRect &&
        createPortal(
          <FlyingImage
            imageUrl={flying.imageUrl}
            startRect={flying.startRect}
            endRect={flying.endRect}
            onEnd={handleAnimationEnd}
          />,
          document.body
        )}
    </FlyToCartContext.Provider>
  );
}

function FlyingImage({ imageUrl, startRect, endRect, onEnd }) {
  const [phase, setPhase] = useState('start');
  const size = 48;

  useEffect(() => {
    if (!endRect) return;
    const id = requestAnimationFrame(() => setPhase('end'));
    return () => cancelAnimationFrame(id);
  }, [endRect]);

  useEffect(() => {
    if (phase !== 'end') return;
    const t = setTimeout(onEnd, 620);
    return () => clearTimeout(t);
  }, [phase, onEnd]);

  const w = phase === 'start' ? Math.min(startRect.width, 72) : size;
  const h = phase === 'start' ? Math.min(startRect.height, 72) : size;
  const left =
    phase === 'start'
      ? startRect.left + startRect.width / 2 - w / 2
      : endRect
        ? endRect.left + endRect.width / 2 - size / 2
        : startRect.left;
  const top =
    phase === 'start'
      ? startRect.top + startRect.height / 2 - h / 2
      : endRect
        ? endRect.top + endRect.height / 2 - size / 2
        : startRect.top;

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 99999,
        width: w,
        height: h,
        left,
        top,
        pointerEvents: 'none',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '2px solid #fff',
      }}
    >
      <img src={imageUrl} alt="" className="w-full h-full object-contain bg-white" />
    </div>
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  return ctx;
}
