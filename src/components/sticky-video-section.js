import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollContainer = document.querySelector('.solution-video_scroll-container');
const solutionVideos = gsap.utils.toArray('.solution-video');
const textSteps = gsap.utils.toArray('.solution_text-step');

if (scrollContainer && solutionVideos.length > 0 && textSteps.length > 0) {
  const scrollSteps = [
    { startPercent: 0, endPercent: 10 },
    { startPercent: 11, endPercent: 37 },
    { startPercent: 38, endPercent: 100 },
  ];

  // Initialzustand
  solutionVideos.forEach((el, i) => {
    el.classList.remove('is-active');
    el.pause?.();
    if (i === 0) {
      el.classList.add('is-active');
      el.play?.();
    }
  });

  textSteps.forEach((el, i) => {
    el.classList.remove('is-active');
    if (i === 0) el.classList.add('is-active');
  });

  // ScrollTrigger erstellen
  solutionVideos.forEach((el, i) => {
    const step = scrollSteps[i];
    if (!step) return;

    ScrollTrigger.create({
      trigger: scrollContainer,
      start: `${step.startPercent}% top`,
      end: `${step.endPercent}% top`,
      onEnter: () => {
        solutionVideos.forEach((v) => {
          v.classList.remove('is-active');
          v.pause?.();
        });
        el.classList.add('is-active');
        el.play?.();

        textSteps.forEach((t) => t.classList.remove('is-active'));
        if (textSteps[i]) textSteps[i].classList.add('is-active');
      },
      onEnterBack: () => {
        solutionVideos.forEach((v) => {
          v.classList.remove('is-active');
          v.pause?.();
        });
        el.classList.add('is-active');
        el.play?.();

        textSteps.forEach((t) => t.classList.remove('is-active'));
        if (textSteps[i]) textSteps[i].classList.add('is-active');
      },
      id: `solution-video-step-${i + 1}`,
    });
  });
}
