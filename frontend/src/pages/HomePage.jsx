import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import HeroSlider from '../components/HeroSlider';
import { animateSection, animateStagger, animateReveal } from '../utils/gsap';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

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

  useEffect(() => {
    const tweens = [];
    if (heroRef.current) {
      const t = animateReveal(heroRef.current, { duration: 0.9, start: 'top 95%' });
      if (t) tweens.push(t);
    }
    if (section1Ref.current) {
      const t = animateSection(section1Ref.current);
      if (t) tweens.push(t);
      const t2 = animateStagger(section1Ref.current, '.home-product-card', { stagger: 0.06 });
      if (t2) tweens.push(t2);
    }
    if (section2Ref.current) {
      const t = animateSection(section2Ref.current);
      if (t) tweens.push(t);
      const t2 = animateStagger(section2Ref.current, '.home-product-card', { stagger: 0.06 });
      if (t2) tweens.push(t2);
    }
    if (section3Ref.current) {
      const t = animateSection(section3Ref.current);
      if (t) tweens.push(t);
      const t2 = animateStagger(section3Ref.current, '.home-product-card', { stagger: 0.06 });
      if (t2) tweens.push(t2);
    }
    if (section4Ref.current) {
      const t = animateSection(section4Ref.current);
      if (t) tweens.push(t);
      const t2 = animateStagger(section4Ref.current, '.home-category-card', { stagger: 0.05 });
      if (t2) tweens.push(t2);
    }
    return () => tweens.forEach((t) => t?.scrollTrigger?.kill());
  }, [loading]);

  return (
    <div className="min-w-0 overflow-x-hidden">
      <div ref={heroRef}>
        <HeroSlider />
      </div>

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <section
          ref={section1Ref}
          className="py-6 sm:py-10 bg-gray-100 dark:bg-gray-900 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6"
        >
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Kampanyalı ürünler</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : featured.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {featured.map((p) => (
                <div key={p._id} className="home-product-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Kampanyalı ürün bulunamadı.</p>
          )}
        </section>

        <section
          ref={section2Ref}
          className="py-6 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6 shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">En çok satanlar</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : bestsellers.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {bestsellers.map((p) => (
                <div key={p._id} className="home-product-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Henüz veri yok.</p>
          )}
        </section>

        <section
          ref={section3Ref}
          className="py-6 sm:py-12 bg-gray-100 dark:bg-gray-900 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6"
        >
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Yeni gelenler</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : newArrivals.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {newArrivals.map((p) => (
                <div key={p._id} className="home-product-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">Henüz veri yok.</p>
          )}
        </section>

        <section
          ref={section4Ref}
          className="py-6 sm:py-12 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl px-4 sm:px-6 mt-4 sm:mt-6 shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-extrabold mb-4 sm:mb-5 text-gray-800 dark:text-gray-200">Kategoriler</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {['Telefon', 'Bilgisayar', 'Tablet', 'TV', 'Ses Sistemleri', 'Oyun'].map((cat) => (
              <Link
                key={cat}
                to={`/urunler?category=${encodeURIComponent(cat)}`}
                className="home-category-card p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm sm:text-base text-center font-semibold hover:border-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
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
