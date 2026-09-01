(() => {
  const audio = document.getElementById('bgm-audio');
  const toggle = document.getElementById('bgm-toggle');
  if (!audio || !toggle) return;

  audio.volume = .75;
  audio.loop = true;

  let userPaused = false;

  const tryPlay = async () => {
    try {
      await audio.play();
      toggle.classList.remove('is-error');
      toggle.title = '';
      return true;
    } catch (error) {
      if (error && error.name !== 'NotAllowedError') {
        toggle.classList.add('is-error');
        toggle.title = '无法播放，请检查音乐文件';
      }
      return false;
    }
  };

  const updateState = () => {
    const playing = !audio.paused && !audio.ended;
    toggle.classList.toggle('is-playing', playing);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
  };

  const resumeOnGesture = event => {
    if (toggle.contains(event.target)) return;
    if (!userPaused && audio.paused && !audio.ended) tryPlay();
  };

  toggle.addEventListener('click', async () => {
    if (audio.paused) {
      userPaused = false;
      await tryPlay();
    } else {
      userPaused = true;
      audio.pause();
    }
    updateState();
  });

  audio.addEventListener('play', updateState);
  audio.addEventListener('pause', updateState);
  audio.addEventListener('ended', updateState);

  ['pointerdown', 'touchstart', 'keydown', 'wheel', 'touchmove', 'scroll'].forEach(type => {
    window.addEventListener(type, resumeOnGesture, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !userPaused && audio.paused) tryPlay();
  });

  if (document.readyState === 'complete') tryPlay();
  else window.addEventListener('load', tryPlay);

  updateState();
})();
