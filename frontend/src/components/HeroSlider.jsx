import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getActiveSlides } from '../services/sliderService';
import { FiChevronLeft, FiChevronRight, FiZap } from 'react-icons/fi';
import { getGSAP } from '../utils/gsap';

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const didSwipe = useRef(false);
  const slideWrapRef = useRef(null);

  useEffect(() => {
    getActiveSlides()
      .then((r) => setSlides(r.data.slides || []))
      .catch(() => setSlides([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  useEffect(() => {
    const { gsap } = getGSAP();
    if (!gsap || !slideWrapRef.current || !slides.length) return;
    gsap.fromTo(slideWrapRef.current, { opacity: 0.7 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }, [index, slides.length]);

  const goTo = (nextIndex) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      didSwipe.current = true;
      if (diff > 0) goTo(index + 1);
      else goTo(index - 1);
      setTimeout(() => { didSwipe.current = false; }, 300);
    }
  };
  const onSlideClick = (e) => {
    if (didSwipe.current) e.preventDefault();
  };

  if (loading || !slides.length) {
    return (
      <section className="relative text-white py-20 md:py-28 px-4 rounded-b-3xl overflow-hidden">
        <div className="absolute inset-0 hero-theme-gradient" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 hero-theme-glow rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 hero-theme-glow rounded-full blur-3xl animate-float-delay" style={{ opacity: 0.7 }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 hero-theme-glow rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s', opacity: 0.5 }} />
        <div className="relative container mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-bold bg-white/20 backdrop-blur rounded-full border border-white/30">
            <FiZap className="w-4 h-4" aria-hidden />
            Kampanyalar devam ediyor
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white drop-shadow-lg tracking-tight">
            Teknoloji burada,<br />fırsat burada
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-8 max-w-xl mx-auto">
            En yeni cihazlar ve kampanyalı fiyatlarla tanış.
          </p>
          <Link
            to="/urunler"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-theme font-bold rounded-2xl hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
          >
            Ürünlere göz at
            <FiChevronRight className="w-5 h-5" aria-hidden />
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[index];
  const hasMultiple = slides.length > 1;

  return (
    <section
      className="relative overflow-hidden rounded-b-3xl bg-gray-200 dark:bg-gray-800 touch-pan-y select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={slideWrapRef} className="relative aspect-[4/3] sm:aspect-[21/10] md:aspect-[21/9] min-h-[220px] sm:min-h-[240px] md:min-h-[280px]">
        {slide.link ? (
          <Link to={slide.link} className="block w-full h-full" onClick={onSlideClick}>
            <img
              src={slide.image}
              alt={slide.title || 'Banner'}
              className="w-full h-full object-cover object-center pointer-events-none"
              draggable={false}
            />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white bg-black/20">
                {slide.title && <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold drop-shadow">{slide.title}</h2>}
                {slide.subtitle && <p className="mt-1 md:mt-2 text-sm md:text-lg opacity-95">{slide.subtitle}</p>}
              </div>
            )}
          </Link>
        ) : (
          <>
            <img src={slide.image} alt={slide.title || 'Banner'} className="w-full h-full object-cover object-center" draggable={false} />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6 md:px-12 text-white bg-black/20">
                {slide.title && <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold drop-shadow">{slide.title}</h2>}
                {slide.subtitle && <p className="mt-1 md:mt-2 text-sm md:text-lg opacity-95">{slide.subtitle}</p>}
              </div>
            )}
          </>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 dark:text-white shadow-lg transition-ux"
              aria-label="Önceki"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-800 dark:text-white shadow-lg transition-ux"
              aria-label="Sonraki"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
