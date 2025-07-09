import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('.solution_scroll-container');
const solutionImages = gsap.utils.toArray('.solution-image');
const textSteps = gsap.utils.toArray('.solution_text-step');

if (scrollContainer && solutionImages.length > 0 && textSteps.length > 0) {
  const scrollSteps = [
    { startPercent: 0, endPercent: 10 },
    { startPercent: 11, endPercent: 37 },
    { startPercent: 38, endPercent: 48 },
  ];

  solutionImages.forEach((el, i) => {
    el.classList.remove('is-active');
    if (i === 0) el.classList.add('is-active');
  });

  solutionImages.forEach((el, i) => {
    const step = scrollSteps[i];
    if (!step) return;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: `${step.startPercent}% top`,
      end: `${step.endPercent}% top`,
      onEnter: () => {
        solutionImages.forEach((img) => img.classList.remove('is-active'));
        textSteps.forEach((step) => step.classList.remove('is-active'));
        el.classList.add('is-active');
        if (textSteps[i]) textSteps[i].classList.add('is-active');
      },
      onEnterBack: () => {
        solutionImages.forEach((img) => img.classList.remove('is-active'));
        textSteps.forEach((step) => step.classList.remove('is-active'));
        el.classList.add('is-active');
        if (textSteps[i]) textSteps[i].classList.add('is-active');
      },
      id: `solution-step-${i + 1}`,
    });
  });
}
