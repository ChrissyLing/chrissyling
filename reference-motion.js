/* Viewport count-up, reveal and restrained collage parallax adapted to this site. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const formatter = new Intl.NumberFormat('en-US');
  const running = new Map();
  const counters = [...document.querySelectorAll('[data-count]')];
  function countUp(el) {
    if (el.dataset.counted || reduce.matches) return;
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    el.dataset.counted = 'true';
    const suffix = el.dataset.suffix || '';
    const final = el.textContent.trim();
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');
    visual.className = 'counter-visual';
    const accessible = document.createElement('span');
    accessible.className = 'motion-sr-only';
    accessible.textContent = final;
    el.replaceChildren(visual, accessible);
    const finish = () => { el.textContent = final; running.delete(el); };
    const state = { frame: 0, finish };
    running.set(el, state);
    let start;
    const duration = 1500 + Math.min(900, target / 20);
    function frame(time) {
      if (reduce.matches) { finish(); return; }
      if (start === undefined) start = time;
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      visual.textContent = formatter.format(Math.round(target * eased)) + suffix;
      if (progress < 1) state.frame = requestAnimationFrame(frame);
      else finish();
    }
    visual.textContent = '0' + suffix;
    state.frame = requestAnimationFrame(frame);
  }
  let observer;
  if ('IntersectionObserver' in window && !reduce.matches) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { countUp(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.7 });
    counters.forEach(el => observer.observe(el));
  }

  const launch = document.querySelector('[data-demo-launch]');
  launch?.addEventListener('click', () => {
    const wrap = launch.closest('.demo-on-demand');
    const frame = wrap?.querySelector('iframe');
    if (!frame || !frame.dataset.src) return;
    frame.src = frame.dataset.src;
    wrap.classList.add('is-active');
    frame.focus();
  }, { once: true });

  const collage = document.querySelector('.hero-image-side');
  let pointerFrame = 0;
  let pointerX = 0, pointerY = 0;
  const resetCollage = () => {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    if (collage) {
      collage.style.setProperty('--collage-x', '0px');
      collage.style.setProperty('--collage-y', '0px');
    }
  };
  if (collage && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    collage.addEventListener('pointermove', event => {
      if (reduce.matches) return;
      const box = collage.getBoundingClientRect();
      pointerX = (event.clientX - box.left) / box.width - 0.5;
      pointerY = (event.clientY - box.top) / box.height - 0.5;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        collage.style.setProperty('--collage-x', `${pointerX * 10}px`);
        collage.style.setProperty('--collage-y', `${pointerY * 8}px`);
        pointerFrame = 0;
      });
    }, { passive: true });
    collage.addEventListener('pointerleave', resetCollage);
  }
  reduce.addEventListener('change', () => {
    if (!reduce.matches) return;
    observer?.disconnect();
    for (const state of [...running.values()]) { cancelAnimationFrame(state.frame); state.finish(); }
    document.querySelectorAll('.reveal,.exp-card,.side-project-card').forEach(el => el.classList.add('visible'));
    resetCollage();
  });
})();

/* Mouse dragging and explicit paging for the selected-post rail. */
(() => {
 const rail = document.querySelector('#xhs .xhs-grid');
 if (!rail) return;
 const progress = document.querySelector('.xhs-rail-progress');
 let startX = 0, startScroll = 0, dragging = false;
 rail.addEventListener('pointerdown', event => {
   if (event.pointerType !== 'mouse' || event.button !== 0) return;
   dragging = true; startX = event.clientX; startScroll = rail.scrollLeft;
   rail.setPointerCapture(event.pointerId); rail.classList.add('is-dragging');
 });
 rail.addEventListener('pointermove', event => {
   if (dragging) rail.scrollLeft = startScroll - (event.clientX - startX);
 });
 const end = () => { dragging = false; rail.classList.remove('is-dragging'); };
 rail.addEventListener('pointerup', end); rail.addEventListener('pointercancel', end);
 rail.addEventListener('scroll', () => {
   const max = rail.scrollWidth - rail.clientWidth;
   progress?.style.setProperty('--rail-progress', `${max > 0 ? rail.scrollLeft / max * 185 : 0}%`);
 }, { passive: true });
 const page = direction => rail.scrollBy({left: direction * rail.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
 document.querySelector('[data-xhs-prev]')?.addEventListener('click', () => page(-1));
 document.querySelector('[data-xhs-next]')?.addEventListener('click', () => page(1));
 rail.tabIndex = 0;
 rail.setAttribute('aria-label', '小红书作品，可拖动或使用左右方向键浏览');
 rail.addEventListener('keydown', event => {
   if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
     event.preventDefault(); page(event.key === 'ArrowRight' ? 1 : -1);
   }
 });
})();
