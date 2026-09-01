(() => {
  const voyage = document.querySelector('.voyage');
  const scene = document.querySelector('.scene');
  const boat = document.querySelector('.boat-track');
  const reedForeground = document.querySelector('.reed-foreground');
  const lotusFar = document.querySelector('.lotus-far');
  const lotusNear = document.querySelector('.lotus-near');
  const boatContactTrigger = document.querySelector('.boat-contact-trigger');
  const boatProfile = document.querySelector('.boat-profile');
  const profileDim = document.querySelector('.profile-dim');
  const islandRows = [...document.querySelectorAll('.project-island-row')];
  const boatFrames = [...document.querySelectorAll('.boat-frame')];
  const aboutIsletSection = document.querySelector('.about-islet-section');
  const aboutIsletScroll = document.querySelector('.about-islet-scroll');
  const aboutRipples = document.querySelector('.about-ripples');
  const aboutFogBack = document.querySelector('.about-fog-back');
  const aboutFogFront = document.querySelector('.about-fog-front');
  const aboutCopy = document.querySelector('.about-copy');
  const aboutSteps = [...document.querySelectorAll('.about-step')];
  const aboutRouteLead = document.querySelector('.about-route-lead');
  const aboutRoutePath = document.querySelector('.about-route-lead path');
  const experienceVoyage = document.querySelector('.experience-voyage');
  const experienceRoute = document.querySelector('.experience-route');
  const experienceRouteGuide = document.querySelector('.experience-route__base');
  const experienceRouteProgress = document.querySelector('.experience-route__progress');
  const experienceRouteMarker = document.querySelector('.experience-route__marker');
  const experienceNodes = [...document.querySelectorAll('.career-buoy')];
  const experiencePanels = [...document.querySelectorAll('.experience-panel')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let boatFrameIndex = 0;
  let activeAboutStep = 0;
  let activeExperience = 0;
  let experienceSwitchTimer = null;

  const setBoatProfile = open => {
    scene.classList.toggle('profile-open', open);
    boatProfile.classList.toggle('is-open', open);
    boatProfile.setAttribute('aria-hidden', String(!open));
    boatProfile.toggleAttribute('inert', !open);
    boatContactTrigger.setAttribute('aria-expanded', String(open));
    scene.querySelectorAll('.loop, .reed-loop').forEach(element => {
      element.getAnimations().forEach(animation => {
        if (typeof animation.updatePlaybackRate === 'function') animation.updatePlaybackRate(open ? .72 : 1);
        else animation.playbackRate = open ? .72 : 1;
      });
    });
    if (!open) boatContactTrigger.focus({ preventScroll: true });
  };

  boatContactTrigger.addEventListener('click', () => setBoatProfile(!boatProfile.classList.contains('is-open')));
  profileDim.addEventListener('click', () => setBoatProfile(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && boatProfile.classList.contains('is-open')) setBoatProfile(false);
  });

  if (!reduced && boatFrames.length > 1) {
    const decoded = boatFrames.map(img => img.decode ? img.decode().catch(() => undefined) : Promise.resolve());
    Promise.all(decoded).then(() => {
      let previousFrameTime = 0;
      const playBoatFrames = timestamp => {
        if (!previousFrameTime) previousFrameTime = timestamp;
        if (timestamp - previousFrameTime >= 135) {
          boatFrames[boatFrameIndex].classList.remove('is-active');
          boatFrameIndex = (boatFrameIndex + 1) % boatFrames.length;
          boatFrames[boatFrameIndex].classList.add('is-active');
          previousFrameTime = timestamp;
        }
        requestAnimationFrame(playBoatFrames);
      };
      requestAnimationFrame(playBoatFrames);
    });
  }

  if (!reduced) {
    const lotusLayers = [...document.querySelectorAll('.layer-lotus')];
    const lotusImages = [...document.querySelectorAll('.layer-lotus .lotus-tile img')];
    let lotusTick = false;
    const dodgeLotus = event => {
      if (lotusTick) return;
      lotusTick = true;
      requestAnimationFrame(() => {
        lotusTick = false;
        const mx = event.clientX;
        const my = event.clientY;
        lotusImages.forEach(img => {
          const rect = img.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = mx - cx;
          const dy = my - cy;
          const dist = Math.hypot(dx, dy);
          const near = dist > 0 && dist < 150;
          const vx = near ? -dx / dist * 38 : 0;
          const vy = near ? -dy / dist * 22 : 0;
          const flipped = img.matches(':nth-child(3)');
          img.style.transform = flipped
            ? `scaleX(-1) translate(${-vx}px, ${vy}px)`
            : `translate(${vx}px, ${vy}px)`;
        });
      });
    };
    lotusLayers.forEach(layer => {
      layer.addEventListener('mousemove', dodgeLotus, { passive: true });
      layer.addEventListener('mouseleave', () => {
        lotusImages.forEach(img => { img.style.transform = ''; });
      });
    });
  }

  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
  const range = (p, start, end) => clamp((p - start) / (end - start));

  const setAboutStep = index => {
    const nextIndex = Math.round(clamp(index, 0, aboutSteps.length - 1));
    activeAboutStep = nextIndex;
    aboutSteps.forEach((step, stepIndex) => {
      step.classList.toggle('is-active', stepIndex === nextIndex);
      step.classList.toggle('is-before', stepIndex < nextIndex);
      step.setAttribute('aria-hidden', String(stepIndex !== nextIndex));
    });
  };

  const renderAbout = () => {
    if (!aboutIsletSection || !aboutIsletScroll) return;
    const rect = aboutIsletSection.getBoundingClientRect();
    const total = Math.max(rect.height - innerHeight, 1);
    const progress = clamp(-rect.top / total);
    const enter = range(progress, 0, .1);
    const fogReveal = range(progress, 0, .2);
    const isletGrow = range(progress, .2, .46);
    const copyReveal = range(progress, .24, .36);
    const leave = range(progress, .78, 1);
    const enterEase = enter * enter * (3 - 2 * enter);
    const fogEase = fogReveal * fogReveal * (3 - 2 * fogReveal);
    const isletEase = isletGrow * isletGrow * (3 - 2 * isletGrow);
    const copyEase = copyReveal * copyReveal * (3 - 2 * copyReveal);
    const leaveEase = leave * leave * (3 - 2 * leave);
    const stepIndex = progress < .48 ? 0 : progress < .72 ? 1 : 2;
    if (stepIndex !== activeAboutStep) setAboutStep(stepIndex);

    const x = leaveEase * 8;
    const y = (1 - enterEase) * 8 + leaveEase * 5;
    const scale = (.56 + isletEase * .32) * (1 - leaveEase * .12);
    aboutIsletScroll.style.transform = `translate3d(calc(-50% - ${x}vw), calc(-50% + ${y}vh), 0) scale(${scale})`;
    aboutIsletScroll.style.opacity = String(.25 + isletEase * .75);

    if (aboutFogBack) {
      aboutFogBack.style.opacity = String((.6 - fogEase * .4) * (1 - leaveEase * .55));
      aboutFogBack.style.transform = `translate3d(${fogEase * -2.2}vw, ${fogEase * -1.2}vh, 0) scale(${1 + fogEase * .05})`;
    }

    if (aboutFogFront) {
      aboutFogFront.style.opacity = String((.8 - fogEase * .72) * (1 - leaveEase * .7));
      aboutFogFront.style.transform = `translate3d(${fogEase * 2.8}vw, ${fogEase * -2.4}vh, 0) scale(${1 + fogEase * .08})`;
    }

    if (aboutRipples) {
      aboutRipples.style.opacity = String(isletEase * (.72 - leaveEase * .38));
      aboutRipples.style.transform = `translate3d(-50%, -50%, 0) scale(${.93 + isletEase * .07 + leaveEase * .04})`;
    }

    if (aboutCopy) aboutCopy.style.opacity = String((.08 + copyEase * .92) * (1 - leaveEase));

    const routeProgress = range(progress, .8, .97);
    if (aboutRouteLead) {
      aboutRouteLead.style.opacity = String(routeProgress);
      aboutRouteLead.style.transform = `translate3d(${(1 - routeProgress) * -12}px, ${(1 - routeProgress) * 9}px, 0)`;
    }
    if (aboutRoutePath) aboutRoutePath.style.strokeDashoffset = String(1 - routeProgress);
  };

  const setExperience = index => {
    const nextIndex = Math.round(clamp(index, 0, experiencePanels.length - 1));
    if (nextIndex === activeExperience) return;
    const previousIndex = activeExperience;
    activeExperience = nextIndex;
    experienceNodes.forEach((node, nodeIndex) => {
      const isCurrent = nodeIndex === nextIndex;
      node.classList.toggle('is-active', isCurrent);
      node.classList.toggle('is-passed', nodeIndex < nextIndex);
      node.setAttribute('aria-pressed', String(isCurrent));
    });
    const previousPanel = experiencePanels[previousIndex];
    const nextPanel = experiencePanels[nextIndex];
    clearTimeout(experienceSwitchTimer);
    previousPanel.classList.remove('is-active');
    previousPanel.classList.add('is-leaving');
    nextPanel.classList.remove('is-leaving');
    nextPanel.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => nextPanel.classList.add('is-active')));
    experienceSwitchTimer = setTimeout(() => {
      experiencePanels.forEach((panel, panelIndex) => {
        const active = panelIndex === activeExperience;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
        panel.classList.remove('is-leaving');
      });
    }, 230);
  };

  const renderExperience = () => {
    if (!experienceVoyage || !experienceRouteGuide) return;
    const rect = experienceVoyage.getBoundingClientRect();
    const total = Math.max(rect.height - innerHeight, 1);
    const progress = clamp(-rect.top / total);
    const index = progress < .2 ? 0 : progress < .43 ? 1 : progress < .66 ? 2 : progress < .88 ? 3 : 4;
    if (index !== activeExperience) setExperience(index);
    if (experienceRouteProgress) experienceRouteProgress.style.strokeDashoffset = String(1 - progress);
    if (experienceRoute) experienceRoute.classList.toggle('is-arrived', progress >= .88);
    if (experienceRouteMarker && typeof experienceRouteGuide.getTotalLength === 'function') {
      const point = experienceRouteGuide.getPointAtLength(experienceRouteGuide.getTotalLength() * progress);
      experienceRouteMarker.setAttribute('cx', point.x.toFixed(2));
      experienceRouteMarker.setAttribute('cy', point.y.toFixed(2));
    }
  };

  experienceNodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      if (!experienceVoyage) return;
      setExperience(index);
      const targets = [.1, .35, .6, .86];
      const sectionTop = scrollY + experienceVoyage.getBoundingClientRect().top;
      const total = Math.max(experienceVoyage.offsetHeight - innerHeight, 1);
      scrollTo({ top: sectionTop + total * targets[index], behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  const render = () => {
    if (!voyage) return;
    const total = voyage.offsetHeight - innerHeight;
    const p = clamp(-voyage.getBoundingClientRect().top / Math.max(total, 1));
    const leave = range(p, .52, .92);
    const reedExit = leave;
    const reedEase = reedExit * reedExit * reedExit * (reedExit * (reedExit * 6 - 15) + 10);
    const lotusExit = range(p, .5, .88);
    const lotusEase = lotusExit * lotusExit * (3 - 2 * lotusExit);
    const exitFade = range(p, .74, .96);
    boat.style.transform = `translate3d(calc(-50% + ${leave * 72}vw),0,0) rotate(${leave * .45}deg) scale(${1 - leave * .04})`;
    boat.style.opacity = 1 - exitFade;
    reedForeground.style.transform = `translate3d(0, ${-reedEase * 108}%, 0) scale(${1 + reedEase * .025})`;
    reedForeground.style.opacity = 1 - exitFade;
    lotusFar.style.translate = `${-lotusEase * 42}vw 0`;
    lotusNear.style.translate = `${lotusEase * 42}vw 0`;
    lotusFar.style.opacity = .72 * (1 - lotusEase);
    lotusNear.style.opacity = .92 * (1 - lotusEase);
    islandRows.forEach((row, index) => {
      const rect = row.getBoundingClientRect();
      const distance = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      const visibility = clamp(1 - Math.abs(distance) * 1.12);
      const direction = index % 2 === 0 ? -1 : 1;
      row.style.setProperty('--island-x', `${distance * direction * 58}px`);
      row.style.setProperty('--island-y', `${distance * 46}px`);
      row.style.setProperty('--island-scale', .94 + visibility * .06);
      row.style.setProperty('--island-opacity', .12 + visibility * .88);
    });
  };
  let ticking = false;
  const requestRender = () => { if (!ticking) requestAnimationFrame(() => { render(); ticking = false; }); ticking = true; };
  let experienceTicking = false;
  const requestExperienceRender = () => {
    if (!experienceTicking) requestAnimationFrame(() => { renderExperience(); experienceTicking = false; });
    experienceTicking = true;
  };
  let aboutTicking = false;
  const requestAboutRender = () => {
    if (!aboutTicking) requestAnimationFrame(() => { renderAbout(); aboutTicking = false; });
    aboutTicking = true;
  };
  if (!reduced) addEventListener('scroll', requestRender, {passive:true});
  if (aboutIsletSection) addEventListener('scroll', requestAboutRender, {passive:true});
  if (experienceVoyage) addEventListener('scroll', requestExperienceRender, {passive:true});
  addEventListener('resize', requestRender);
  addEventListener('resize', requestAboutRender);
  addEventListener('resize', requestExperienceRender);
  document.querySelector('[data-year]').textContent = new Date().getFullYear();
  setAboutStep(0);
  setExperience(0);
  renderAbout();
  renderExperience();
  render();
})();
