/* Shared motion layer for Overflow concept pages.
   GSAP + ScrollTrigger + Lenis. Transform and opacity only.
   prefers-reduced-motion and weak CPUs get opacity fades, nothing else. */
(function () {
  if (window.__ovMotion) return;
  window.__ovMotion = true;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var weak = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  var lite = reduce || weak;

  function boot() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis && !lite) {
      // Lenis disabled completely: keep fast native scroll
      document.documentElement.classList.add("has-native-scroll");
    }

    if (lite) {
      gsap.set("main section, main article", { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    gsap.utils.toArray("main section").forEach(function (section, index) {
      if (section.classList.contains("hero") || section.querySelector(".hero")) return;
      var bits = section.querySelectorAll("h2, h3, p, li, figure, article, .card");
      var targets = bits.length ? bits : [section];
      gsap.set(targets, { opacity: 0, y: 18 });
      ScrollTrigger.create({
        trigger: section,
        start: "top 86%",
        once: true,
        onEnter: function () {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: Math.min(0.06, 0.4 / targets.length),
            delay: index === 0 ? 0 : 0.02
          });
        }
      });
    });

    document.querySelectorAll("a, button").forEach(function (el) {
      if (el.closest(".ov-badge, header, nav")) return;
      el.addEventListener("pointerenter", function () {
        gsap.to(el, { y: -2, duration: 0.18, ease: "power2.out", overwrite: "auto" });
      });
      el.addEventListener("pointerleave", function () {
        gsap.to(el, { y: 0, duration: 0.22, ease: "power2.out", overwrite: "auto" });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
