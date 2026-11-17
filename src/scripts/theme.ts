type Theme = 'studio' | 'studio-dark';

const STORAGE_KEY = 'overflow-theme';
const root = document.documentElement;

if (root.dataset.themeAdaptive === 'true') {
  const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const colorPreference = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let transitionTimer = 0;

  const storedTheme = (): Theme | null => {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (value === 'dark') return 'studio-dark';
      return value === 'studio' || value === 'studio-dark' ? value : null;
    } catch {
      return null;
    }
  };

  const syncControls = (theme: Theme) => {
    const isDark = theme === 'studio-dark';

    toggles.forEach((toggle) => {
      const label = isDark ? toggle.dataset.labelLight : toggle.dataset.labelDark;
      const titleLabel = label || (isDark ? 'Switch to light mode' : 'Switch to dark mode');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.setAttribute('aria-label', 'Toggle dark mode');
      toggle.setAttribute('title', titleLabel);

      const visibleLabel = toggle.querySelector<HTMLElement>('[data-theme-label]');
      if (visibleLabel && label) visibleLabel.textContent = label;
    });
  };

  const applyTheme = (theme: Theme, options: { animate?: boolean; persist?: boolean } = {}) => {
    const { animate = false, persist = false } = options;
    const isDark = theme === 'studio-dark';

    if (animate && !reducedMotion.matches) {
      root.classList.add('theme-changing');
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => root.classList.remove('theme-changing'), 320);
    }

    root.dataset.theme = theme;
    document.body.dataset.theme = theme;
    root.style.colorScheme = isDark ? 'dark' : 'light';
    const csMeta = document.querySelector('meta[name="color-scheme"]');
    if (csMeta) csMeta.setAttribute('content', isDark ? 'dark' : 'light');
    if (themeColor) themeColor.content = isDark ? '#0f1017' : '#f4f2ec';
    syncControls(theme);
    window.dispatchEvent(new CustomEvent('overflow:theme-change', { detail: { theme } }));

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch {}
    }
  };

  const initialTheme: Theme = root.dataset.theme === 'studio-dark' ? 'studio-dark' : 'studio';
  applyTheme(initialTheme);

  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const nextTheme: Theme = root.dataset.theme === 'studio-dark' ? 'studio' : 'studio-dark';
      applyTheme(nextTheme, { animate: true, persist: true });
    });
  });

  colorPreference.addEventListener('change', (event) => {
    if (storedTheme()) return;
    applyTheme(event.matches ? 'studio-dark' : 'studio', { animate: true });
  });

  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    const nextTheme: Theme | null =
      event.newValue === 'dark' || event.newValue === 'studio-dark'
        ? 'studio-dark'
        : event.newValue === 'studio'
          ? 'studio'
          : null;
    if (nextTheme) {
      applyTheme(nextTheme, { animate: true });
    } else if (event.newValue === null) {
      applyTheme(colorPreference.matches ? 'studio-dark' : 'studio', { animate: true });
    }
  });
}
