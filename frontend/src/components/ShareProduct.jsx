import { useState } from 'react';
import { FiShare2, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ShareProduct({ product, url }) {
  const [open, setOpen] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const text = product?.name ? `${product.name} - İncele` : 'Ürünü incele';

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      toast.success('Link kopyalandı');
      setOpen(false);
    }).catch(() => toast.error('Kopyalanamadı'));
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
    setOpen(false);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
      >
        <FiShare2 className="w-4 h-4" />
        Paylaş
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 py-2 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <button type="button" onClick={copyLink} className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              <FiCopy className="w-4 h-4" /> Linki kopyala
            </button>
            <button type="button" onClick={shareWhatsApp} className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              WhatsApp
            </button>
            <button type="button" onClick={shareTwitter} className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              X (Twitter)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
