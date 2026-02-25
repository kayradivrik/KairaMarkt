import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { useSettings } from '../context/SettingsContext';
import Breadcrumb from '../components/Breadcrumb';
import { submit as submitContact } from '../services/contactService';

export default function ContactPage() {
  const { contactEmail, contactPhone, address, workingHours } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    submitContact(form)
      .then(() => {
        setForm({ name: '', email: '', subject: '', message: '' });
        toast.success('Mesajınız alındı. En kısa sürede dönüş yapacağız.');
      })
      .catch((err) => toast.error(err.message || 'Gönderilemedi.'))
      .finally(() => setSending(false));
  };

  const contactItems = [
    { icon: FiMail, label: 'E-posta', value: contactEmail || 'destek@example.com', href: contactEmail ? `mailto:${contactEmail}` : null },
    { icon: FiPhone, label: 'Telefon', value: contactPhone || '0850 XXX XX XX', href: contactPhone ? `tel:${contactPhone.replace(/\s/g, '')}` : null },
    { icon: FiMapPin, label: 'Adres', value: address || 'Adres bilgisi site ayarlarından eklenebilir.', href: null },
    { icon: FiClock, label: 'Çalışma saatleri', value: workingHours || 'Pazartesi - Cuma 09:00 - 18:00', href: null },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumb items={[{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim' }]} />

      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-theme/10 text-theme">
          <FiMail className="w-8 h-8" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">İletişim</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5">Sorularınız için bize ulaşın</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {contactItems.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="flex gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-theme shrink-0">
                <Icon className="w-5 h-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                {href ? (
                  <a href={href} className="text-gray-900 dark:text-white font-medium break-all hover:text-theme transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-gray-900 dark:text-white font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bize yazın</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adınız
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme focus:border-transparent"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Konu
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme focus:border-transparent"
                  placeholder="Konu başlığı"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mesajınız
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-theme focus:border-transparent resize-y min-h-[120px]"
                  placeholder="Mesajınızı yazın..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-3 btn-theme font-semibold rounded-2xl disabled:opacity-50"
              >
                <FiSend className="w-5 h-5" aria-hidden />
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
