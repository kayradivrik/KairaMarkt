import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, tax, itemCount } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    if (itemCount === 0) {
      getProducts({ limit: 4, sort: 'popular' })
        .then((r) => setSuggestedProducts(r.data.products || []))
        .catch(() => setSuggestedProducts([]));
    }
  }, [itemCount]);

  if (itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-theme-subtle text-theme">
            <FiShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sepetiniz boş</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Alışverişe başlayarak favori ürünlerinizi sepete ekleyebilirsiniz.</p>
          <Link to="/urunler" className="inline-flex items-center gap-2 px-6 py-3 btn-theme font-semibold rounded-2xl transition-ux">
            Alışverişe Başla
          </Link>
        </div>
        {suggestedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">Önerilen ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    );
  }

  const total = subtotal + tax;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sepet ({itemCount} ürün)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const p = item.product;
            const price = p?.discountPrice ?? p?.price ?? 0;
            const lineTotal = price * item.quantity;
            return (
              <div key={p?._id} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                  {p?.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" /> : <div className="w-full h-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/urun/${p?.slug || p?._id}`} className="font-medium text-gray-900 dark:text-white hover:text-theme line-clamp-2">{p?.name}</Link>
                  <p className="text-theme font-bold mt-1">{price?.toLocaleString('tr-TR')} ₺</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button type="button" onClick={() => updateQuantity(p._id, item.quantity - 1)} className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600">−</button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(p._id, item.quantity + 1)} className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600">+</button>
                    <button type="button" onClick={() => removeItem(p._id)} className="ml-2 p-1 text-theme hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-medium">{lineTotal?.toLocaleString('tr-TR')} ₺</div>
              </div>
            );
          })}
        </div>
        <div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 sticky top-24">
            <h2 className="font-bold mb-4">Özet</h2>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div className="flex justify-between"><span>Ara toplam</span><span>{subtotal?.toLocaleString('tr-TR')} ₺</span></div>
              <div className="flex justify-between"><span>KDV (%18)</span><span>{tax?.toLocaleString('tr-TR')} ₺</span></div>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span>Toplam</span><span>{total?.toLocaleString('tr-TR')} ₺</span>
            </div>
            <Link to="/odeme" className="mt-6 block w-full py-3 btn-theme text-center font-bold rounded-2xl">Ödemeye Geç</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
