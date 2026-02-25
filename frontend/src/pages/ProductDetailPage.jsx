import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProductBySlug, getProductById, getProducts } from '../services/productService';
import { getReviews, createReview, updateReview, deleteReview } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../context/FlyToCartContext';
import { useAuth } from '../context/AuthContext';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { useWishlist } from '../hooks/useWishlist';
import { FiHeart, FiStar } from 'react-icons/fi';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ProductCard from '../components/ProductCard';
import Breadcrumb from '../components/Breadcrumb';
import { ProductDetailSkeleton } from '../components/Skeleton';

const reviewSchema = Yup.object({ rating: Yup.number().min(1).max(5).required(), comment: Yup.string() });

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem } = useCart();
  const fly = useFlyToCart();
  const { user } = useAuth();
  const { add: addRecent } = useRecentlyViewed();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const isId = /^[a-f0-9]{24}$/i.test(slug);
    const req = isId ? getProductById(slug) : getProductBySlug(slug);
    req
      .then((r) => {
        setProduct(r.data.product);
        addRecent(r.data.product);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug, addRecent]);

  useEffect(() => {
    if (!product?._id) return;
    getReviews(product._id)
      .then((r) => setReviews(r.data.reviews || []))
      .catch(() => setReviews([]));
  }, [product?._id]);

  useEffect(() => {
    if (!product?.category) return;
    getProducts({ category: product.category, limit: 5 })
      .then((r) => {
        const list = (r.data.products || []).filter((p) => p._id !== product._id).slice(0, 4);
        setSimilarProducts(list);
      })
      .catch(() => setSimilarProducts([]));
  }, [product?._id, product?.category]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">Ürün bulunamadı.</p>
        <Link to="/urunler" className="mt-4 inline-block text-theme font-semibold hover:underline">Ürünlere dön</Link>
      </div>
    );
  }

  const price = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice != null;

  const handleAddCart = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect?.();
    if (fly?.addItemWithFly && product?.images?.[0] && rect) {
      fly.addItemWithFly(product, 1, rect);
      toast.success('Sepete eklendi');
    } else {
      addItem(product, 1);
      toast.success('Sepete eklendi');
    }
  };

  const handleReviewSubmit = (values) => {
    const api = reviewForm?.reviewId ? updateReview(product._id, reviewForm.reviewId, values) : createReview(product._id, values);
    api
      .then((r) => {
        setReviews((prev) => {
          const list = reviewForm?.reviewId ? prev.map((rev) => (rev._id === reviewForm.reviewId ? r.data.review : rev)) : [r.data.review, ...prev];
          return list;
        });
        setProduct((p) => ({ ...p, rating: p.rating, reviewCount: reviews.length + (reviewForm?.reviewId ? 0 : 1) }));
        setReviewForm(null);
        toast.success(reviewForm?.reviewId ? 'Yorum güncellendi' : 'Yorum eklendi');
      })
      .catch((e) => toast.error(e.message));
  };

  const handleDeleteReview = (reviewId) => {
    if (!window.confirm('Yorumu silmek istediğinize emin misiniz?')) return;
    deleteReview(product._id, reviewId)
      .then(() => {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        toast.success('Yorum silindi');
      })
      .catch((e) => toast.error(e.message));
  };

  const myReview = user ? reviews.find((r) => r.user?._id === user._id) : null;

  const images = Array.isArray(product.images) ? product.images : (product.images ? [product.images] : []);
  const mainImage = images[selectedImageIndex] || images[0];
  const stockNum = product.stock ?? 0;
  const stockVariant = stockNum > 10 ? 'green' : stockNum >= 1 ? 'yellow' : 'red';

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Ürünler', href: '/urunler' }, { label: product.name.length > 50 ? product.name.slice(0, 50) + '…' : product.name }]} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain p-4 transition-ux" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Görsel yok</div>
            )}
            <button type="button" onClick={() => toggle(product._id)} className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 transition-ux hover:scale-105">
              <FiHeart className={`w-6 h-6 ${has(product._id) ? 'fill-theme text-theme' : ''}`} />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} type="button" onClick={() => setSelectedImageIndex(i)} className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-ux ${selectedImageIndex === i ? 'border-theme ring-1 ring-theme-subtle' : 'border-gray-200 dark:border-gray-600'}`}>
                  <img src={img} alt="" className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
          {product.brand && <p className="text-gray-500 dark:text-gray-400 mt-1">{product.brand}</p>}
          <div className="flex items-center gap-4 mt-4">
            {hasDiscount && <span className="text-gray-500 line-through">{product.price?.toLocaleString('tr-TR')} ₺</span>}
            <span className="text-2xl font-bold text-theme">{price?.toLocaleString('tr-TR')} ₺</span>
          </div>
          {product.rating > 0 && (
            <p className="mt-2 text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
              <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden />
              {product.rating?.toFixed(1)} ({product.reviewCount} yorum)
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Stok:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockVariant === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : stockVariant === 'yellow' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'}`}>
              {stockNum > 10 ? 'Yeterli stok' : stockNum >= 1 ? 'Son birkaç ürün' : 'Stokta yok'}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Ürün açıklaması</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{product.description || 'Bu ürün için henüz açıklama eklenmemiş.'}</p>
          </div>
          {product.technicalSpecs?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Teknik özellikler</h3>
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <tbody>
                  {product.technicalSpecs.filter((s) => (s?.name ?? '').trim() || (s?.value ?? '').trim()).map((s, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-700 last:border-0">
                      <td className="px-3 py-2 bg-gray-50 dark:bg-gray-800 font-medium text-gray-700 dark:text-gray-300">{s.name || '—'}</td>
                      <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{s.value || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button type="button" onClick={handleAddCart} disabled={stockNum === 0} className="mt-6 w-full md:w-auto px-8 py-3 btn-theme font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-ux">
            Sepete Ekle
          </button>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Benzer ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Yorumlar</h2>
        {user && (myReview ? (
          <div className="mb-6">
            {reviewForm?.reviewId === myReview._id ? (
              <Formik initialValues={{ rating: myReview.rating, comment: myReview.comment || '' }} validationSchema={reviewSchema} onSubmit={handleReviewSubmit} onReset={() => setReviewForm(null)}>
                {({ errors, touched }) => (
                  <Form className="space-y-2">
                    <div>
                      <label className="block text-sm">Puan</label>
                      <Field as="select" name="rating" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1">
                        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} yıldız</option>)}
                      </Field>
                    </div>
                    <Field as="textarea" name="comment" rows={3} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" placeholder="Yorum" />
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-2 btn-theme rounded-2xl">Güncelle</button>
                      <button type="reset" className="px-4 py-2 border rounded">İptal</button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="inline-flex items-center gap-1">
                <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden />
                {myReview.rating} – {myReview.comment || '(yorum yok)'}
              </p>
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => setReviewForm({ reviewId: myReview._id })} className="text-sm text-theme">Düzenle</button>
                  <button type="button" onClick={() => handleDeleteReview(myReview._id)} className="text-sm text-theme">Sil</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Formik initialValues={{ rating: 5, comment: '' }} validationSchema={reviewSchema} onSubmit={handleReviewSubmit}>
            {({ errors }) => (
              <Form className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
                <label className="block text-sm">Puan</label>
                <Field as="select" name="rating" className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1">
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} yıldız</option>)}
                </Field>
                <Field as="textarea" name="comment" rows={3} className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" placeholder="Yorum (sadece satın aldıysanız yorum yapabilirsiniz)" />
                <button type="submit" className="px-4 py-2 btn-theme rounded-2xl text-sm">Gönder</button>
              </Form>
            )}
          </Formik>
        ))}

        <ul className="space-y-4">
          {reviews.filter((r) => r._id !== reviewForm?.reviewId).map((rev) => (
            <li key={rev._id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex justify-between">
                <span className="font-medium">{rev.user?.name || 'Kullanıcı'}</span>
                <span className="text-amber-500 inline-flex items-center gap-0.5">
                  <FiStar className="w-4 h-4 fill-amber-500" aria-hidden />
                  {rev.rating}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{rev.comment || '(yorum yok)'}</p>
            </li>
          ))}
        </ul>
        {reviews.length === 0 && !user && <p className="text-gray-500">Henüz yorum yok.</p>}
      </section>
    </div>
  );
}
