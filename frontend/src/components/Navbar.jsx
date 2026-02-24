/**
 * Üst menü - logo, arama, sepet, tema, kullanıcı
 * Mobil: sağdan açılan drawer, gruplu linkler, scroll kilidi
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiPackage, FiTag, FiHelpCircle, FiTruck, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFlyToCart } from '../context/FlyToCartContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const DEBOUNCE_MS = 350;
const MINI_CART_AUTO_CLOSE_MS = 4000;

const closeMenu = (setOpen) => () => setOpen(false);

const IconSun = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);
const IconMoon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const prevItemCountRef = useRef(0);
  const debounceRef = useRef(null);
  const { user, isAdmin, logout } = useAuth();
  const { items, itemCount } = useCart();
  const { cartIconRef } = useFlyToCart() || {};
  const { dark, toggle } = useTheme();
  const { siteName, logoUrl, showLogo, primaryColor } = useSettings();
  const navigate = useNavigate();
  const brandColor = primaryColor || '#b91c1c';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (itemCount > prevItemCountRef.current) setMiniCartOpen(true);
    prevItemCountRef.current = itemCount;
  }, [itemCount]);

  useEffect(() => {
    if (!miniCartOpen) return;
    const t = setTimeout(() => setMiniCartOpen(false), MINI_CART_AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [miniCartOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(searchInput), DEBOUNCE_MS);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchInput]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') setOpen(false); };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = (searchInput || search).trim();
    if (q) navigate(`/urunler?search=${encodeURIComponent(q)}`);
  };

  const headerBg = scrolled
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-700/80'
    : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-gray-200 dark:border-gray-700';

  return (
    <header className={`sticky top-0 z-50 ${headerBg} shadow-soft transition-ux duration-200`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between min-h-[72px] md:min-h-24 py-2">
          <Link to="/" className="flex items-center gap-3 text-lg md:text-xl font-extrabold tracking-tight hover:opacity-90 transition-ux shrink-0" style={{ color: brandColor }}>
            {showLogo && logoUrl ? (
              <span className="flex h-14 md:h-[4.5rem] shrink-0 items-center" style={{ minHeight: 56 }}>
                <img src={logoUrl} alt={siteName} className="h-full w-auto max-w-[220px] object-contain" style={{ minHeight: 48 }} />
              </span>
            ) : (
              siteName || 'KairaMarkt'
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link to="/urunler" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">Ürünler</Link>
            <Link to="/kampanyalar" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">Kampanyalar</Link>
            <Link to="/hakkimizda" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">Hakkımızda</Link>
            <Link to="/sss" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">SSS</Link>
            <Link to="/forum" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">Forum</Link>
            <Link to="/iletisim" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux">İletişim</Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ne aramıştın?"
              className="w-full rounded-2xl rounded-r-none border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-theme focus:border-transparent transition-ux"
            />
            <button type="submit" className="rounded-2xl rounded-l-none btn-theme px-4 py-2 transition-ux">
              <FiSearch className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux"
              aria-label={dark ? 'Açık tema' : 'Koyu tema'}
            >
              {dark ? <IconSun /> : <IconMoon />}
            </button>
            <div
              className="relative"
              onMouseEnter={() => setMiniCartOpen(true)}
              onMouseLeave={() => setMiniCartOpen(false)}
            >
              <Link to="/sepet" ref={cartIconRef} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex transition-ux">
                <FiShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-theme text-white text-xs min-w-[20px] h-5 px-1 rounded-full font-semibold flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
              {(miniCartOpen && itemCount > 0) && (
                <div className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-auto rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-card-hover py-2 z-50 transition-ux">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">Sepet</span>
                    <span className="text-gray-500 text-sm ml-2">({itemCount} ürün)</span>
                  </div>
                  <ul className="max-h-64 overflow-y-auto">
                    {items.slice(0, 5).map(({ product: p, quantity }) => (
                      <li key={p?._id} className="flex gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-ux">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {p?.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-contain" /> : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p?.name}</p>
                          <p className="text-xs text-theme">{quantity} × {(p?.discountPrice ?? p?.price)?.toLocaleString('tr-TR')} ₺</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="px-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link to="/sepet" className="block w-full py-2.5 text-center btn-theme font-semibold rounded-xl transition-ux text-sm">
                      Sepete git
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {user ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <FiUser className="w-6 h-6" />
                  <span className="text-sm">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-1 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-card-hover border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-ux duration-150">
                  <Link to="/profil" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setOpen(false)}>
                    Profil
                  </Link>
                  <Link to="/siparislerim" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                    Siparişlerim
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                      Admin
                    </Link>
                  )}
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-theme hover:bg-gray-100 dark:hover:bg-gray-700">
                    Çıkış
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/giris" className="hidden md:inline-flex items-center gap-2 px-4 py-2 btn-theme rounded-2xl text-sm font-semibold transition-ux">
                <FiUser /> Giriş
              </Link>
            )}
            <button
              type="button"
              className="md:hidden relative z-[100] p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={open}
            >
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobil: overlay + drawer portal ile body'e, böylece üstte ve tıklanabilir kalır */}
        {typeof document !== 'undefined' &&
          createPortal(
            <div className="md:hidden">
              <div
                role="presentation"
                className={`fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
                  open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setOpen(false)}
                aria-hidden="true"
              />
              <aside
                aria-modal="true"
                aria-label="Menü"
                className={`fixed top-0 right-0 z-[9999] h-full w-full max-w-[300px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col transition-transform duration-200 ease-out ${
                  open ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
              <span className="text-lg font-bold text-theme">Menü</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-3 -m-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-ux"
                aria-label="Menüyü kapat"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearch} className="px-4 pt-4 pb-2 shrink-0">
              <div className="flex gap-2">
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ürün ara..."
                  className="flex-1 min-w-0 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-base"
                />
                <button type="submit" className="rounded-xl btn-theme px-4 py-3 shrink-0" aria-label="Ara">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-2 py-4">
              <div className="mb-6">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Alışveriş</p>
                <ul className="space-y-0.5">
                  <li>
                    <Link to="/urunler" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      <FiPackage className="w-5 h-5 text-theme shrink-0" /> Ürünler
                    </Link>
                  </li>
                  <li>
                    <Link to="/kampanyalar" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      <FiTag className="w-5 h-5 text-theme shrink-0" /> Kampanyalar
                    </Link>
                  </li>
                  <li>
                    <Link to="/sepet" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      <FiShoppingCart className="w-5 h-5 text-theme shrink-0" />
                      Sepet
                      {itemCount > 0 && (
                        <span className="ml-auto bg-theme text-white text-xs font-bold min-w-[22px] h-6 px-1.5 rounded-full flex items-center justify-center">
                          {itemCount > 99 ? '99+' : itemCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mb-6">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Yardım & Bilgi</p>
                <ul className="space-y-0.5">
                  <li>
                    <Link to="/hakkimizda" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      Hakkımızda
                    </Link>
                  </li>
                  <li>
                    <Link to="/sss" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      <FiHelpCircle className="w-5 h-5 text-gray-400 shrink-0" /> SSS
                    </Link>
                  </li>
                  <li>
                    <Link to="/forum" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      Forum
                    </Link>
                  </li>
                  <li>
                    <Link to="/teslimat" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      <FiTruck className="w-5 h-5 text-gray-400 shrink-0" /> Teslimat
                    </Link>
                  </li>
                  <li>
                    <Link to="/iade" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      İade
                    </Link>
                  </li>
                  <li>
                    <Link to="/iletisim" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                      İletişim
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hesap</p>
                <ul className="space-y-0.5">
                  {user ? (
                    <>
                      <li>
                        <Link to="/profil" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                          <FiUser className="w-5 h-5 text-gray-400 shrink-0" /> {user.name}
                        </Link>
                      </li>
                      <li>
                        <Link to="/siparislerim" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-800 dark:text-gray-200 font-medium active:bg-gray-100 dark:active:bg-gray-800 transition-colors">
                          Siparişlerim
                        </Link>
                      </li>
                      {isAdmin && (
                        <li>
                          <Link to="/admin" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-theme font-medium active:bg-theme-subtle transition-colors">
                            Admin Paneli
                          </Link>
                        </li>
                      )}
                      <li>
                        <button type="button" onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-3 px-4 py-3.5 rounded-xl text-theme font-medium active:bg-theme-subtle transition-colors text-left">
                          <FiLogOut className="w-5 h-5 shrink-0" /> Çıkış
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link to="/giris" onClick={closeMenu(setOpen)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl btn-theme font-semibold transition-colors">
                        <FiUser className="w-5 h-5 shrink-0" /> Giriş yap
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
              </aside>
            </div>,
            document.body
          )}
      </div>
    </header>
  );
}
