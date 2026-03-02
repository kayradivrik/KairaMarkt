import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiX, FiArrowUpRight, FiSend } from 'react-icons/fi';

const QUICK_ACTIONS = [
  { id: 'home', label: 'Ana sayfa', path: '/' },
  { id: 'products', label: 'Ürünler', path: '/urunler' },
  { id: 'cart', label: 'Sepetim', path: '/sepet' },
  { id: 'campaigns', label: 'Kampanyalar', path: '/kampanyalar' },
  { id: 'faq', label: 'S.S.S.', path: '/sss' },
  { id: 'contact', label: 'İletişim', path: '/iletisim' },
];

export default function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: 'Merhaba! 👋 Nasıl yardımcı olabilirim? Aşağıdaki kısayollardan birine tıklayabilir veya bana bir soru yazabilirsin.',
    },
  ]);
  const navigate = useNavigate();

  const toggleOpen = () => setOpen((v) => !v);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botMessage = {
      id: Date.now() + 1,
      from: 'bot',
      text: 'Şu an basit bir demo asistanıyım. Gerçek yapay zeka cevabı görmek için sonradan bir AI API entegrasyonu ekleyebiliriz.',
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      {/* Aç/Kapat butonu */}
      <button
        type="button"
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-theme text-white shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme"
        aria-label="Yapay zeka asistanını aç"
      >
        {open ? <FiX className="w-6 h-6" /> : <FiMessageCircle className="w-6 h-6" />}
      </button>

      {/* Küçük hızlı işlem penceresi */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-w-[90vw] rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-theme to-emerald-400 text-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                <FiMessageCircle className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Kaira Asistan</p>
                <p className="text-[11px] leading-none opacity-80">Sorularınızı hızlıca yanıtlar</p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme focus:ring-white"
              aria-label="Pencereyi kapat"
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>

          <div className="px-3 py-2 text-[11px] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/60">
            Sık kullanılan alanlara tek tıkla gidebilir veya alttan sohbet edebilirsin.
          </div>

          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-1 space-y-3 text-sm max-h-72">
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => handleNavigate(action.path)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-left hover:bg-theme/10 dark:hover:bg-theme/20 text-gray-800 dark:text-gray-100 transition-colors"
                >
                  <span>{action.label}</span>
                  <FiArrowUpRight className="w-4 h-4 opacity-70" />
                </button>
              ))}

              <button
                type="button"
                onClick={handleScrollTop}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-left hover:bg-theme/10 dark:hover:bg-theme/20 text-gray-800 dark:text-gray-100 transition-colors"
              >
                <span>Sayfanın en üstüne çık</span>
                <FiArrowUpRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-1 space-y-2">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[80%] ${
                      m.from === 'user'
                        ? 'bg-theme text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (!open && e.target.value.trim()) {
                  setOpen(true);
                }
              }}
              placeholder="Bana bir şey yaz..."
              className="flex-1 text-xs px-3 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-theme/70"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-theme text-white h-8 w-8 hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
              disabled={!input.trim()}
              aria-label="Mesaj gönder"
            >
              <FiSend className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

