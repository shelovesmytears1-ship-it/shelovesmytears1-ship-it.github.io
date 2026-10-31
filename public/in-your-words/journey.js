(() => {
  const steps = document.querySelector(".roadmap-steps");
  const tabs = Array.from(steps?.querySelectorAll("[data-roadmap-step]") || []);
  const progress = steps?.querySelector("[data-journey-progress]");
  if (!steps || !progress || tabs.length === 0) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let tween = null;

  const syncProgress = (animate = true) => {
    const selectedIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true"));
    const scale = (selectedIndex + 1) / tabs.length;
    steps.style.setProperty("--active-journey-step", String(selectedIndex + 1));

    if (window.gsap && !reducedMotion.matches && animate) {
      tween?.kill();
      tween = window.gsap.to(progress, {
        scaleY: scale,
        duration: 0.45,
        ease: "power2.out",
        overwrite: true
      });
      return;
    }

    tween?.kill();
    if (window.gsap) window.gsap.set(progress, { scaleY: scale });
    else progress.style.transform = `scaleY(${scale})`;
  };

  window.addEventListener("contentpanelchange", (event) => {
    if (event.detail?.selector === "#roadmap-panel") syncProgress();
  });

  reducedMotion.addEventListener("change", () => syncProgress(false));
  syncProgress(false);
})();
