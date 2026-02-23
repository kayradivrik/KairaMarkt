import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import HeroSlider from '../components/HeroSlider';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts({ featured: 'true', limit: 8 }).then((r) => r.data.products),
      getProducts({ sort: 'popular', limit: 8 }).then((r) => r.data.products),
      getProducts({ sort: 'new', limit: 8 }).then((r) => r.data.products),
    ])
      .then(([f, b, n]) => {
        setFeatured(f);
        setBestsellers(b);
        setNewArrivals(n);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <HeroSlider />

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <section className="py-8 sm:py-10 bg-gray-100 dark:bg-gray-900 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Kampanyalı ürünler</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featured.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Kampanyalı ürün bulunamadı.</p>
          )}
        </section>

        <section className="py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">En çok satanlar</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : bestsellers.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {bestsellers.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Henüz veri yok.</p>
          )}
        </section>

        <section className="py-8 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6">
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Yeni gelenler</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : newArrivals.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Henüz veri yok.</p>
          )}
        </section>

        <section className="py-8 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6 shadow-sm">
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {['Telefon', 'Bilgisayar', 'Tablet', 'TV', 'Ses Sistemleri', 'Oyun'].map((cat) => (
              <Link
                key={cat}
                to={`/urunler?category=${encodeURIComponent(cat)}`}
                className="p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm sm:text-base text-center font-semibold hover:border-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
