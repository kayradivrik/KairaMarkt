/**
 * Üst menü - logo, arama, sepet, tema, kullanıcı
 * Scroll'da blur/transparan derinlik; hover 150–200ms easing; debounced arama; mini cart dropdown
 * KairaMarkt - Kayra tarafından yapılmıştır
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
// import logoImg from '../assets/logo.svg';

const DEBOUNCE_MS = 350;
const MINI_CART_AUTO_CLOSE_MS = 4000;

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
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

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
          <Link to="/" className="flex items-center gap-3 text-lg md:text-xl font-extrabold text-red-600 dark:text-red-400 tracking-tight hover:opacity-90 transition-ux">
            KairaMarkt
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ne aramıştın?"
              className="w-full rounded-2xl rounded-r-none border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-ux"
            />
            <button type="submit" className="rounded-2xl rounded-l-none bg-brand-500 text-white px-4 py-2 hover:bg-brand-600 transition-ux">
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
              <Link to="/sepet" className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 inline-flex transition-ux">
                <FiShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-xs min-w-[20px] h-5 px-1 rounded-full font-semibold flex items-center justify-center">
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
                          <p className="text-xs text-red-600 dark:text-red-400">{quantity} × {(p?.discountPrice ?? p?.price)?.toLocaleString('tr-TR')} ₺</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="px-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <Link to="/sepet" className="block w-full py-2.5 text-center bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-ux text-sm">
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
                  <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-brand-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Çıkış
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/giris" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 text-sm font-semibold transition-ux">
                <FiUser /> Giriş
              </Link>
            )}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-ux" onClick={() => setOpen(!open)}>
              {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ürün ara..."
                className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm"
              />
              <button type="submit" className="rounded-2xl bg-brand-500 text-white px-4 py-2">Ara</button>
            </form>
            <Link to="/urunler" className="block py-2" onClick={() => setOpen(false)}>Ürünler</Link>
            <Link to="/sepet" className="block py-2" onClick={() => setOpen(false)}>Sepet</Link>
            {user ? (
              <>
                <Link to="/profil" className="block py-2" onClick={() => setOpen(false)}>Profil</Link>
                <Link to="/siparislerim" className="block py-2" onClick={() => setOpen(false)}>Siparişlerim</Link>
                {isAdmin && <Link to="/admin" className="block py-2" onClick={() => setOpen(false)}>Admin</Link>}
                <button onClick={() => { logout(); setOpen(false); }} className="block py-2 text-brand-600">Çıkış</button>
              </>
            ) : (
              <Link to="/giris" className="block py-2" onClick={() => setOpen(false)}>Giriş</Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
