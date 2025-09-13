const navbar = document.querySelector('.navbar');
const { body } = document;

if (navbar) {
  const noAnimation = body.getAttribute('navbar') === 'no-animation';

  if (noAnimation) {
    // Direkt auf "scrolled" setzen
    navbar.classList.add('scrolled');
  } else {
    // Nur mit Scroll aktivieren
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 200);
    });
  }
}
