import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('.solution_scroll-container');
const solutionImages = gsap.utils.toArray('.solution-image');

if (scrollContainer && solutionImages.length > 0) {
  // Manuelle Definition der Scrollabschnitte
  const scrollSteps = [
    { startPercent: 0, endPercent: 15 },
    { startPercent: 16, endPercent: 32 },
    { startPercent: 33, endPercent: 49 },
  ];

  // Initiale Klassenzuordnung
  solutionImages.forEach((el, i) => {
    el.classList.remove('is-active');
    if (i === 0) el.classList.add('is-active');
  });

  // Trigger pro Bild
  solutionImages.forEach((el, i) => {
    const step = scrollSteps[i];
    if (!step) return;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: `${step.startPercent}% top`,
      end: `${step.endPercent}% top`,
      onEnter: () => {
        solutionImages.forEach((img) => img.classList.remove('is-active'));
        el.classList.add('is-active');
        console.log(`→ is-active gesetzt bei .is-${i + 1}`);
      },
      onEnterBack: () => {
        solutionImages.forEach((img) => img.classList.remove('is-active'));
        el.classList.add('is-active');
        console.log(`← is-active zurückgesetzt bei .is-${i + 1}`);
      },
      markers: true,
      id: `solution-step-${i + 1}`,
    });
  });
}
