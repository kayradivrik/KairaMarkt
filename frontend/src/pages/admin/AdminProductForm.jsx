import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { createProduct, updateAdminProduct } from '../../services/adminService';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'yeni';
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!id || id === 'yeni') return;
    api.get(`/products/${id}`)
      .then((r) => setProduct(r.data.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  if (!isNew && loading) return <div className="flex justify-center py-12"><div className="w-10 h-10 border-2 border-theme border-t-transparent rounded-full animate-spin" /></div>;
  if (!isNew && !product) return <p>Ürün bulunamadı.</p>;

  const initial = product || {
    name: '', description: '', price: '', discountPrice: '', stock: '', brand: '', category: 'Telefon', subCategory: '', featured: false, isActive: true, images: [],
    technicalSpecs: [{ name: '', value: '' }],
  };
  if (initial.technicalSpecs == null || !Array.isArray(initial.technicalSpecs)) initial.technicalSpecs = [{ name: '', value: '' }];
  if (initial.technicalSpecs.length === 0) initial.technicalSpecs = [{ name: '', value: '' }];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isNew ? 'Yeni Ürün' : 'Ürün Düzenle'}</h1>
      <Formik
        initialValues={initial}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            if (isNew) {
              const form = new FormData();
              form.append('name', values.name || '');
              form.append('description', values.description || '');
              form.append('price', values.price ?? '');
              form.append('discountPrice', values.discountPrice ?? '');
              form.append('stock', values.stock ?? '');
              form.append('brand', values.brand || '');
              form.append('category', values.category || 'Telefon');
              form.append('subCategory', values.subCategory || '');
              form.append('featured', values.featured ? 'true' : 'false');
              form.append('isActive', values.isActive !== false ? 'true' : 'false');
              const specs = (values.technicalSpecs || []).filter((s) => (s?.name ?? '').trim() || (s?.value ?? '').trim());
              form.append('technicalSpecs', JSON.stringify(specs.map((s) => ({ name: (s?.name ?? '').trim(), value: (s?.value ?? '').trim() }))));
              if (values.images?.length && values.images[0]?.file) {
                for (const item of values.images) if (item?.file) form.append('images', item.file);
              }
              await createProduct(form);
              toast.success('Ürün eklendi');
            } else {
              const specs = (values.technicalSpecs || []).filter((s) => (s?.name ?? '').trim() || (s?.value ?? '').trim());
              await updateAdminProduct(id, {
                ...values,
                price: Number(values.price),
                discountPrice: values.discountPrice ? Number(values.discountPrice) : null,
                stock: Number(values.stock),
                technicalSpecs: specs.map((s) => ({ name: (s?.name ?? '').trim(), value: (s?.value ?? '').trim() })),
              });
              toast.success('Ürün güncellendi');
            }
            navigate('/admin/urunler');
          } catch (e) {
            toast.error(e.message || 'İşlem başarısız');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ setFieldValue, values }) => (
          <Form className="max-w-2xl space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ürün adı</label>
              <Field name="name" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ürün açıklaması</label>
              <Field
                as="textarea"
                name="description"
                rows={6}
                placeholder="Ürünün özelliklerini, teknik detaylarını ve müşteriye iletmek istediğiniz bilgileri yazın. Satır atlamak için Enter kullanabilirsiniz."
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 min-h-[140px] resize-y focus:ring-2 focus:ring-theme focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fiyat (₺)</label>
                <Field name="price" type="number" min="0" step="0.01" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">İndirimli fiyat (₺)</label>
                <Field name="discountPrice" type="number" min="0" step="0.01" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Stok</label>
                <Field name="stock" type="number" min="0" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marka</label>
                <Field name="brand" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <Field name="category" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Alt kategori</label>
                <Field name="subCategory" className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2" />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><Field name="featured" type="checkbox" /> Öne çıkan</label>
              <label className="flex items-center gap-2"><Field name="isActive" type="checkbox" /> Aktif</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teknik özellikler</label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Örn: Ekran boyutu, RAM, depolama</p>
              {(values.technicalSpecs || []).map((_, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Field name={`technicalSpecs.${i}.name`} placeholder="Özellik adı" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
                  <Field name={`technicalSpecs.${i}.value`} placeholder="Değer" className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm" />
                  <button type="button" onClick={() => setFieldValue('technicalSpecs', values.technicalSpecs.filter((_, j) => j !== i).length ? values.technicalSpecs.filter((_, j) => j !== i) : [{ name: '', value: '' }])} className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">Sil</button>
                </div>
              ))}
              <button type="button" onClick={() => setFieldValue('technicalSpecs', [...(values.technicalSpecs || []), { name: '', value: '' }])} className="text-sm text-theme font-medium">+ Özellik ekle</button>
            </div>
            {!isNew && values.images?.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Mevcut görseller (URL)</label>
                <div className="flex flex-wrap gap-2">
                  {values.images.map((url, i) => (
                    <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded truncate max-w-[200px]">{typeof url === 'string' ? url : url?.url}</span>
                  ))}
                </div>
              </div>
            )}
            {isNew && (
              <div>
                <label className="block text-sm font-medium mb-1">Görseller</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setFieldValue('images', [...(e.target.files || [])].map((f) => ({ file: f })))} className="w-full text-sm" />
              </div>
            )}
            <div className="flex gap-2">
              <button type="submit" className="px-6 py-2 btn-theme rounded-2xl font-semibold">Kaydet</button>
              <button type="button" onClick={() => navigate('/admin/urunler')} className="px-6 py-2 border rounded-lg">İptal</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
