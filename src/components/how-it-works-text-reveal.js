import gsap from 'gsap';

const trigger = document.querySelector('[how-it-works-text-button]');
const content = document.querySelector('[how-it-works-paragraphs]');

let isOpen = false;

gsap.set(content, { height: 0, autoAlpha: 0 });

trigger.addEventListener('click', () => {
  isOpen = !isOpen;

  if (isOpen) {
    gsap.to(content, {
      height: 'auto',
      autoAlpha: 1,
      duration: 0.4,
      ease: 'power2.out',
    });
    trigger.setAttribute('aria-expanded', 'true');
  } else {
    gsap.to(content, {
      height: 0,
      autoAlpha: 0,
      duration: 0.3,
      ease: 'power2.in',
    });
    trigger.setAttribute('aria-expanded', 'false');
  }
});
