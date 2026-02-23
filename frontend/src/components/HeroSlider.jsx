import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveSlides } from '../services/sliderService';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AUTOPLAY_MS = 5000;

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading || !slides.length) {
    return (
      <section
        className="relative text-white py-16 md:py-20 px-4 rounded-b-3xl"
        style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%)' }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-md">Teknoloji burada, fırsat burada</h1>
          <p className="text-lg text-white/95 mb-6 max-w-xl mx-auto">En yeni cihazlar ve kampanyalı fiyatlarla tanış.</p>
          <Link
            to="/urunler"
            className="inline-block px-6 py-2.5 bg-white text-red-700 font-bold rounded-2xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ürünlere göz at →
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[index];
  const hasMultiple = slides.length > 1;

  return (
    <section className="relative overflow-hidden rounded-b-3xl bg-gray-200 dark:bg-gray-800">
      <div className="relative aspect-[21/9] min-h-[200px] md:min-h-[280px]">
        {slide.link ? (
          <Link to={slide.link} className="block w-full h-full">
            <img
              src={slide.image}
              alt={slide.title || 'Banner'}
              className="w-full h-full object-cover object-center"
            />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white bg-black/20">
                {slide.title && <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow">{slide.title}</h2>}
                {slide.subtitle && <p className="mt-1 md:mt-2 text-sm md:text-lg opacity-95">{slide.subtitle}</p>}
              </div>
            )}
          </Link>
        ) : (
          <>
            <img src={slide.image} alt={slide.title || 'Banner'} className="w-full h-full object-cover object-center" />
            {(slide.title || slide.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white bg-black/20">
                {slide.title && <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow">{slide.title}</h2>}
                {slide.subtitle && <p className="mt-1 md:mt-2 text-sm md:text-lg opacity-95">{slide.subtitle}</p>}
              </div>
            )}
          </>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white text-gray-800 dark:text-white shadow"
              aria-label="Önceki"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white text-gray-800 dark:text-white shadow"
              aria-label="Sonraki"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}
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
