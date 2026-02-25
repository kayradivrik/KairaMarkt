import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories, getBrands } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { ProductCardSkeleton } from '../components/Skeleton';

const SORT_OPTIONS = [
  { value: 'new', label: 'En yeni' },
  { value: 'price_asc', label: 'Fiyat (artan)' },
  { value: 'price_desc', label: 'Fiyat (azalan)' },
  { value: 'popular', label: 'Popüler' },
  { value: 'rating', label: 'Puan' },
];

const THRESHOLD = 200;

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const limit = 12;

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const sort = searchParams.get('sort') || 'new';

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
    setPage(1);
    setProducts([]);
  };

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data.categories || [])).catch(() => {});
    getBrands().then((r) => setBrands(r.data.brands || [])).catch(() => {});
  }, []);

  const loadPage = useCallback((pageNum, append) => {
    const isAppend = append === true;
    if (isAppend) setLoadingMore(true);
    else setLoading(true);
    const query = { page: pageNum, limit, sort, search: search || undefined, category: category || undefined, brand: brand || undefined, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, rating: rating || undefined };
    getProducts(query)
      .then((r) => {
        const list = r.data.products || [];
        const totalCount = r.data.total || 0;
        setTotal(totalCount);
        setProducts((prev) => (isAppend ? [...prev, ...list] : list));
      })
      .catch(() => !isAppend && setProducts([]))
      .finally(() => { setLoading(false); setLoadingMore(false); });
  }, [limit, sort, search, category, brand, minPrice, maxPrice, rating]);

  useEffect(() => {
    loadPage(1, false);
  }, [sort, search, category, brand, minPrice, maxPrice, rating]);

  useEffect(() => {
    if (page === 1) return;
    loadPage(page, true);
  }, [page, loadPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [e] = entries;
        if (!e?.isIntersecting || loading || loadingMore) return;
        const hasMore = products.length < total;
        if (hasMore) setPage((p) => p + 1);
      },
      { rootMargin: `${THRESHOLD}px`, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, loadingMore, products.length, total]);

  const hasMore = products.length < total && total > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler' }]} />
      <h1 className="text-2xl font-bold mb-6">Ürünler</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select value={category} onChange={(e) => updateParam('category', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
              <option value="">Tümü</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Marka</label>
            <select value={brand} onChange={(e) => updateParam('brand', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
              <option value="">Tümü</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fiyat</label>
            <div className="flex gap-2">
              <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
              <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min. Puan</label>
            <select value={rating} onChange={(e) => updateParam('rating', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
              <option value="">Tümü</option>
              {[4, 3, 2].map((r) => (
                <option key={r} value={r}>{r}+ yıldız</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sırala</label>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </aside>
        <div className="flex-1">
          {search && <p className="mb-4">Arama: <span className="text-theme font-medium">&quot;{search}&quot;</span> <span className="text-gray-600 dark:text-gray-400">({total} sonuç)</span></p>}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <div ref={sentinelRef} className="h-4 mt-4" />
              {loadingMore && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                  {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              )}
              {!hasMore && products.length > 0 && <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">Tüm ürünler listelendi.</p>}
            </>
          ) : (
            <p className="text-gray-500 py-12 text-center">Ürün bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
}
