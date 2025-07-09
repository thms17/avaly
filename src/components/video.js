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

function loadVideo(videoContainer, players, index) {
  const videoPlayer = videoContainer.querySelector('[video-component="player"]');
  if (!videoPlayer) return;

  const webmSource = document.createElement('source');
  webmSource.src = 'https://pub-7fbaa389e5474397b18d3032829451d4.r2.dev/avaly-demo-video.webm';
  webmSource.type = 'video/webm';

  const mp4Source = document.createElement('source');
  mp4Source.src = 'https://pub-7fbaa389e5474397b18d3032829451d4.r2.dev/avaly-demo-video.mp4';
  mp4Source.type = 'video/mp4';

  videoPlayer.appendChild(webmSource);
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

  player.on('play', () => {
    setVideoControlsFocusable(videoContainer, true);
  });

  players.set(index, player);
}

function playVideo(players, index) {
  const player = players.get(index);
  if (player) {
    player.play().catch(() => {});
  }
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
