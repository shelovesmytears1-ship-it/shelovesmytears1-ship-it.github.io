(() => {
  // Run in the head, before the browser restores scroll or follows the old hash.
  const navigation = performance.getEntriesByType('navigation')[0];
  if (navigation?.type !== 'reload') return;

  history.scrollRestoration = 'manual';
  if (location.hash) {
    const cleanUrl = new URL(location.href);
    cleanUrl.hash = '';
    history.replaceState(history.state, '', cleanUrl.href);
  }

  const startAtTop = () => {
    window.ScrollTrigger?.clearScrollMemory('manual');
    window.dispatchEvent(new Event('pagestartreset'));
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    window.ScrollTrigger?.update();
  };
  startAtTop();
  window.addEventListener('pageshow', () => {
    startAtTop();
  }, { once: true });

  // Lenis already handles history on desktop; keep native/mobile history usable too.
  window.addEventListener('popstate', () => {
    const smoothDesktop = window.Lenis && window.matchMedia(
      '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)'
    ).matches;
    if (smoothDesktop) return;
    const target = location.hash
      ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
      : document.getElementById('top');
    if (!target) return;
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    const top = location.hash ? target.getBoundingClientRect().top + window.scrollY - headerHeight - 16 : 0;
    target.focus?.({ preventScroll: true });
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'instant' });
  });
})();
