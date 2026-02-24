/**
 * GSAP + ScrollTrigger (CDN) - animasyon yardımcıları
 * KairaMarkt - Kayra tarafından yapılmıştır
 */

export function getGSAP() {
  if (typeof window === 'undefined') return { gsap: null, ScrollTrigger: null };
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

/** Bölümü scroll'da yukarıdan fade-in + hafif yukarı. Dönen tween ile cleanup: tween.scrollTrigger?.kill() */
export function animateSection(el, opts = {}) {
  const { gsap } = getGSAP();
  if (!gsap || !el) return null;
  return gsap.fromTo(
    el,
    { opacity: 0, y: 48 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? 'top 88%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Çocukları sırayla (stagger) animasyonla göster */
export function animateStagger(container, childSelector, opts = {}) {
  const { gsap } = getGSAP();
  if (!gsap || !container) return null;
  const children = container.querySelectorAll(childSelector);
  if (!children.length) return null;
  return gsap.fromTo(
    children,
    { opacity: 0, y: 32 },
    {
      opacity: 1,
      y: 0,
      duration: opts.duration ?? 0.5,
      stagger: opts.stagger ?? 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: opts.start ?? 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  );
}

/** Tek eleman fade + scale */
export function animateReveal(el, opts = {}) {
  const { gsap } = getGSAP();
  if (!gsap || !el) return null;
  return gsap.fromTo(
    el,
    { opacity: 0, scale: 0.96 },
    {
      opacity: 1,
      scale: 1,
      duration: opts.duration ?? 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  );
}
