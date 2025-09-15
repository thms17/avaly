document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth >= 768 && window.innerWidth < 992) {
    const cards = document.querySelectorAll('[hero-glass="card"]');

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        // Optional: nur eine Karte gleichzeitig aktiv
        cards.forEach((c) => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });
  }
});
