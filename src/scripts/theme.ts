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
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', label || '');
      toggle.title = label || '';

      const visibleLabel = toggle.querySelector<HTMLElement>('[data-theme-label]');
      if (visibleLabel && label) visibleLabel.textContent = label;
    });
  };

  const applyTheme = (theme: Theme, options: { animate?: boolean; persist?: boolean } = {}) => {
    const { animate = false, persist = false } = options;

    if (animate && !reducedMotion.matches) {
      root.classList.add('theme-changing');
      window.clearTimeout(transitionTimer);
      transitionTimer = window.setTimeout(() => root.classList.remove('theme-changing'), 320);
    }

    root.dataset.theme = theme;
    document.body.dataset.theme = theme;
    root.style.colorScheme = theme === 'studio-dark' ? 'dark' : 'light';
    if (themeColor) themeColor.content = theme === 'studio-dark' ? '#0f1017' : '#f4f2ec';
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
}
