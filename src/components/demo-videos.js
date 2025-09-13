import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Plyr from 'plyr';
(() => {
  if (!document.body?.matches('[page="produkt"]')) return;

  gsap.registerPlugin(ScrollTrigger);

  /* =========================
     Plyr: Setup & Steuerung
     ========================= */

  const players = new Map();
  const videoContainers = Array.from(document.querySelectorAll('[video-component="container"]'));

  if (videoContainers.length > 0) {
    loadAllVideos(videoContainers, players);

    document.querySelectorAll('[video-component="load-video"]').forEach((button) => {
      button.addEventListener('click', () => handleVideoLoad(button));
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') handleVideoLoad(button);
      });
    });
  }

  // nur ein Video gleichzeitig laufen lassen
  function pauseAllExcept(players, keepIndex) {
    players.forEach((p, idx) => {
      if (idx !== keepIndex) p.pause();
    });
  }

  function handleVideoLoad(button) {
    localStorage.setItem('showVideos', true);

    const videoContainer = button.closest('[video-component="container"]');
    if (!videoContainer) return;

    const index = videoContainers.indexOf(videoContainer);
    const placeholder = videoContainer.querySelector('[video-component="placeholder"]');
    if (placeholder) {
      placeholder.style.display = 'none';
      placeholder.style.pointerEvents = 'none';
    }

    setVideoControlsFocusable(videoContainer, true);

    // erst andere pausieren, dann dieses starten
    pauseAllExcept(players, index);
    playVideo(players, index);
  }

  function loadAllVideos(videoContainers, players) {
    videoContainers.forEach((container, index) => {
      loadVideo(container, players, index);
    });
  }

  // Quellen anhand des data-Attributes `video`
  function loadVideo(videoContainer, players, index) {
    const videoPlayer = videoContainer.querySelector('[video-component="player"]');
    if (!videoPlayer) return;

    const videoId = videoContainer.getAttribute('video');
    if (!videoId) return;

    const sources = {
      1: 'Akzeptanzprognose',
      2: 'Sinus-Milieus',
      3: 'Lokale-Einflussfaktoren',
      4: 'Kontextfaktoren',
    };

    const filename = sources[videoId];
    if (!filename) return;

    const webmSource = document.createElement('source');
    webmSource.src = `https://files.theavaly.com/${filename}.webm`;
    webmSource.type = 'video/webm';
    videoPlayer.appendChild(webmSource);

    const mp4Source = document.createElement('source');
    mp4Source.src = `https://files.theavaly.com/${filename}.mp4`;
    mp4Source.type = 'video/mp4';
    videoPlayer.appendChild(mp4Source);

    const player = new Plyr(videoPlayer, {
      controls: [
        'play-large',
        'play',
        'progress',
        'current-time',
        'volume',
        'settings',
        'fullscreen',
      ],
    });

    setVideoControlsFocusable(videoContainer, false);

    // Wenn per Plyr-UI gestartet wird, andere pausieren
    player.on('play', () => {
      setVideoControlsFocusable(videoContainer, true);
      pauseAllExcept(players, index);
    });

    players.set(index, player);
  }
  function playVideo(players, index) {
    const player = players.get(index);
    if (!player) {
      console.warn('Kein Player für Index:', index);
      console.log('Spieler-Keys:', Array.from(players.keys()));
      return;
    }

    player.play().catch((err) => {
      console.error('Fehler beim Abspielen:', err);
    });
  }

  function setVideoControlsFocusable(videoContainer, isFocusable) {
    const controls = videoContainer.querySelectorAll(
      '.plyr__controls button, .plyr__controls input, .plyr__controls a'
    );

    controls.forEach((control) => {
      if (isFocusable) control.removeAttribute('tabindex');
      else control.setAttribute('tabindex', '-1');
    });
  }

  /* =========================
     GSAP Scroll-Logik (Steps)
     ========================= */

  const scrollContainer = document.querySelector('.solution-video_scroll-container');
  const solutionVideos = gsap.utils.toArray('.solution-video');
  const textSteps = gsap.utils.toArray('.solution_text-step');

  if (scrollContainer && solutionVideos.length > 0 && textSteps.length > 0) {
    // gleichmäßig verteilte Steps, letzter beginnt bewusst früher
    const scrollSteps = [
      { startPercent: 0, endPercent: 10 },
      { startPercent: 11, endPercent: 30 },
      { startPercent: 31, endPercent: 50 },
      { startPercent: 51, endPercent: 70 }, // letzter Step startet früher, damit er "rechtzeitig" aktiv ist
    ];

    // Initialzustand: kein Autoplay
    solutionVideos.forEach((el, i) => {
      el.classList.remove('is-active');
      el.pause?.();
      if (i === 0) el.classList.add('is-active');
    });

    textSteps.forEach((el, i) => {
      el.classList.remove('is-active');
      if (i === 0) el.classList.add('is-active');
    });

    // ScrollTrigger pro Step
    solutionVideos.forEach((el, i) => {
      const step = scrollSteps[i];
      if (!step) return;

      ScrollTrigger.create({
        trigger: scrollContainer,
        start: `${step.startPercent}% top`,
        end: `${step.endPercent}% top`,
        onEnter: () => {
          // alle pausieren, Klassen setzen, aber NICHT automatisch abspielen
          solutionVideos.forEach((v) => {
            v.classList.remove('is-active');
            v.pause?.();
          });
          // zusätzlich alle Plyr-Instanzen pausieren
          players.forEach((p) => p.pause());

          el.classList.add('is-active');

          textSteps.forEach((t) => t.classList.remove('is-active'));
          if (textSteps[i]) textSteps[i].classList.add('is-active');
        },
        onEnterBack: () => {
          solutionVideos.forEach((v) => {
            v.classList.remove('is-active');
            v.pause?.();
          });
          players.forEach((p) => p.pause());

          el.classList.add('is-active');

          textSteps.forEach((t) => t.classList.remove('is-active'));
          if (textSteps[i]) textSteps[i].classList.add('is-active');
        },
        id: `solution-video-step-${i + 1}`,
      });
    });
  }
})();
