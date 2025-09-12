import Plyr from 'plyr';

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

function handleVideoLoad(button) {
  localStorage.setItem('showVideos', true);

  const videoContainer = button.closest('[video-component="container"]');
  if (!videoContainer) return;

  const index = videoContainers.indexOf(videoContainer);
  const placeholder = videoContainer.querySelector('[video-component="placeholder"]');
  if (placeholder) placeholder.style.display = 'none';

  setVideoControlsFocusable(videoContainer, true);
  playVideo(players, index);
}

function loadAllVideos(videoContainers, players) {
  videoContainers.forEach((container, index) => {
    loadVideo(container, players, index);
  });
}

// ✅ Die EINZIGE Stelle, die du ändern musstest:
function loadVideo(videoContainer, players, index) {
  const videoPlayer = videoContainer.querySelector('[video-component="player"]');
  if (!videoPlayer) return;

  const videoId = videoContainer.getAttribute('video');
  if (!videoId) return;

  const sources = {
    1: 'https://files.theavaly.com/Akzeptanzprognose.webm',
    2: 'https://files.theavaly.com/Sinus-Milieus.webm',
    3: 'https://files.theavaly.com/Lokale-Einflussfaktoren.webm',
  };

  const videoSrc = sources[videoId];
  if (!videoSrc) return;

  const webmSource = document.createElement('source');
  webmSource.src = videoSrc;
  webmSource.type = 'video/webm';

  videoPlayer.appendChild(webmSource);

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

  player.on('play', () => {
    setVideoControlsFocusable(videoContainer, true);
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
    if (isFocusable) {
      control.removeAttribute('tabindex');
    } else {
      control.setAttribute('tabindex', '-1');
    }
  });
}
