// ── SCROLL REVEAL ──
(function () {
  // General reveal / reveal-x
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-x').forEach(el => io.observe(el));

  // Brand items — staggered entrance
  const brands = document.querySelectorAll('.brand-item');
  const bioB = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        brands.forEach((b, i) => setTimeout(() => b.classList.add('on'), i * 70));
        bioB.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (brands[0]) bioB.observe(brands[0]);

  // City blocks — staggered entrance
  const cities = document.querySelectorAll('.city-block');
  const bioC = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cities.forEach((c, i) => setTimeout(() => c.classList.add('on'), i * 90));
        bioC.disconnect();
      }
    });
  }, { threshold: 0.08 });
  if (cities[0]) bioC.observe(cities[0]);

  // Map container
  const mc = document.querySelector('.map-container');
  if (mc) {
    const bioM = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { mc.classList.add('on'); bioM.disconnect(); } });
    }, { threshold: 0.1 });
    bioM.observe(mc);
  }

  // Content cards — staggered entrance
  const cards = document.querySelectorAll('.ccard');
  const bioCards = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cards.forEach((c, i) => setTimeout(() => c.classList.add('on'), i * 100));
        bioCards.disconnect();
      }
    });
  }, { threshold: 0.1 });
  if (cards[0]) bioCards.observe(cards[0]);
})();
