// ── GSAP SCROLL PARALLAX ──
// Requires gsap + ScrollTrigger to be loaded before this script.
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.sec-title').forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // Skull parallax on scroll
  ['.deco-skull-l', '.deco-skull-r'].forEach((sel, i) => {
    gsap.to(sel, {
      y: -60 + i * 20,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });
  });
}
