import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../context/FlyToCartContext';

const TILT_MAX = 8;

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { has, toggle } = useWishlist();
  const { addItem } = useCart();
  const fly = useFlyToCart();
  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null;

  const onMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const y = ((e.clientX - centerX) / rect.width) * TILT_MAX;
    const x = ((e.clientY - centerY) / rect.height) * -TILT_MAX;
    setTilt({ x, y });
  };
  const onMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleAddCart = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    if (fly?.addItemWithFly && product?.images?.[0]) {
      fly.addItemWithFly(product, 1, rect);
      toast.success('Sepete eklendi');
    } else {
      addItem(product, 1);
      toast.success('Sepete eklendi');
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-card hover:border-red-200 dark:hover:border-gray-600 transition-all duration-200"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${tilt.x || tilt.y ? 'translateZ(8px)' : ''}`,
        transformStyle: 'preserve-3d',
        boxShadow: tilt.x || tilt.y ? '0 20px 40px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)' : undefined,
      }}
    >
      <Link to={`/urun/${product.slug || product._id}`} className="block relative aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-ux duration-200" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel yok</div>
        )}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-theme text-white text-xs font-bold px-2 py-0.5 rounded-xl">
            %{Math.round((1 - product.discountPrice / product.price) * 100)}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggle(product._id); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-gray-100 dark:hover:bg-gray-700 transition-ux"
        >
          <FiHeart className={`w-5 h-5 ${has(product._id) ? 'fill-theme text-theme' : ''}`} />
        </button>
      </Link>
      <div className="p-4">
        <Link to={`/urun/${product.slug || product._id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 hover:text-theme transition-colors">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">{product.price?.toLocaleString('tr-TR')} ₺</span>
          )}
          <span className="text-lg font-bold text-theme">{price?.toLocaleString('tr-TR')} ₺</span>
        </div>
        {product.rating > 0 && (
          <p className="text-sm text-gray-500 mt-1">★ {product.rating?.toFixed(1)} ({product.reviewCount})</p>
        )}
        <button
          type="button"
          onClick={handleAddCart}
          className="mt-3 w-full py-2.5 rounded-2xl btn-theme text-sm font-bold border-0 cursor-pointer transition-ux"
        >
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
