import Plyr from 'plyr';
const players = new Map();
const videoContainers = Array.from(document.querySelectorAll('[video-component="container"]'));

// Lade alle Videos sofort
loadAllVideos(videoContainers, players);

document.querySelectorAll('[video-component="load-video"]').forEach(function (button) {
  button.addEventListener('click', function () {
    localStorage.setItem('showVideos', true);
    const videoContainer = button.closest('[video-component="container"]');
    const index = videoContainers.indexOf(videoContainer);

    // Entferne den Placeholder und starte das Video
    const placeholder = videoContainer.querySelector('[video-component="placeholder"]');
    if (placeholder) placeholder.style.display = 'none';

    // Steuerelemente aktivieren
    setVideoControlsFocusable(videoContainer, true);

    playVideo(players, index);
  });

  button.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      localStorage.setItem('showVideos', true);
      const videoContainer = button.closest('[video-component="container"]');
      const index = videoContainers.indexOf(videoContainer);

      // Entferne den Placeholder und starte das Video
      const placeholder = videoContainer.querySelector('[video-component="placeholder"]');
      if (placeholder) placeholder.style.display = 'none';

      // Steuerelemente aktivieren
      setVideoControlsFocusable(videoContainer, true);

      playVideo(players, index);
    }
  });
});

function loadAllVideos(videoContainers, players) {
  videoContainers.forEach(function (container, index) {
    loadVideo(container, players, index);
  });
}

function loadVideo(videoContainer, players, index) {
  const videoPlayer = videoContainer.querySelector('[video-component="player"]');

  if (videoPlayer) {
    // Erstelle <source>-Elemente für WebM und MP4
    const webmSource = document.createElement('source');
    webmSource.src = 'https://pub-7fbaa389e5474397b18d3032829451d4.r2.dev/avaly-demo-video.webm';
    webmSource.type = 'video/webm';

    const mp4Source = document.createElement('source');
    mp4Source.src = 'https://pub-7fbaa389e5474397b18d3032829451d4.r2.dev/avaly-demo-video.mp4';
    mp4Source.type = 'video/mp4';

    // Füge die Quellen in der Reihenfolge WebM → MP4 hinzu
    videoPlayer.appendChild(webmSource);
    videoPlayer.appendChild(mp4Source);

    // **Plyr-Player initialisieren**
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

    // **Steuerelemente erst deaktivieren**
    setVideoControlsFocusable(videoContainer, false);

    // Falls notwendig, aktivieren, wenn das Video gestartet wird
    player.on('play', () => {
      setVideoControlsFocusable(videoContainer, true);
    });

    players.set(index, player);
  }
}

function playVideo(players, index) {
  const player = players.get(index);
  if (player) {
    player.play().catch(() => {});
  }
}

// **Funktion zum (De-)Aktivieren der Fokusierbarkeit**
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
