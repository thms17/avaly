if (document.body?.matches('[page="home"]') && window.innerWidth < 992) {
  const cards = document.querySelectorAll('[hero-glass="card"]');

  cards.forEach((card) => {
    const activate = () => {
      cards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
    };

    // iOS Safari: pointerdown zuverlässiger als pointerup
    card.addEventListener('pointerdown', activate);
    // Fallback für ältere Browser
    card.addEventListener('click', activate);
  });
}
