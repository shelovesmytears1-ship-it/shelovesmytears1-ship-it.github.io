(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsap = window.gsap;
  var scrollTrigger = window.ScrollTrigger;
  var LenisConstructor = window.Lenis;
  var lenis = null;

  if (reduceMotion) return;

  if (typeof LenisConstructor === "function") {
    try {
      lenis = new LenisConstructor({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false
      });

      if (gsap && scrollTrigger) {
        gsap.registerPlugin(scrollTrigger);
        lenis.on("scroll", scrollTrigger.update);
        gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        var frame = function (time) {
          lenis.raf(time);
          window.requestAnimationFrame(frame);
        };
        window.requestAnimationFrame(frame);
      }
    } catch (error) {
      lenis = null;
    }
  }

  var scrollToFragment = function (hash) {
    if (!lenis) return;

    if (!hash || hash === "#") {
      lenis.scrollTo(0, { duration: 1.15 });
      return;
    }

    var id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch (error) {
      return;
    }

    var target = document.getElementById(id);
    if (target) {
      lenis.scrollTo(target, {
        offset: -16,
        duration: 1.15,
        easing: function (value) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * value));
        }
      });
    }
  };

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  document.addEventListener("click", function (event) {
    var anchor = event.target.closest('a[href^="#"]');
    if (!anchor || !lenis || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        (anchor.target && anchor.target.toLowerCase() !== "_self") ||
        anchor.hasAttribute("download")) return;

    var hash = anchor.hash;
    if (!hash || hash === "#") return;
    var id;
    try {
      id = decodeURIComponent(hash.slice(1));
    } catch (error) {
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;

    if (window.location.hash !== hash) {
      try {
        window.history.pushState(window.history.state, "", hash);
      } catch (error) {
        return;
      }
    }

    event.preventDefault();
    lenis.scrollTo(target, {
      offset: -16,
      duration: 1.15,
      easing: function (value) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * value));
      }
    });
  });

  window.addEventListener("popstate", function () {
    scrollToFragment(window.location.hash);
  });

  document.addEventListener("essence:advisor-open", function () {
    if (lenis) lenis.stop();
  });

  document.addEventListener("essence:advisor-close", function () {
    if (lenis) lenis.start();
  });

  if (!gsap || !scrollTrigger) return;

  try {
    gsap.registerPlugin(scrollTrigger);

    var heroImage = document.querySelector(".hero__image");
    if (heroImage) {
      gsap.fromTo(heroImage,
        { scale: 1.014, opacity: 0.9 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          ease: "power2.out",
          clearProps: "transform,opacity"
        }
      );
    }

    var compactHero = window.matchMedia("(max-width: 1023px)").matches;
    var heroOrder = compactHero
      ? [".hero__eyebrow", ".hero__title", ".hero__cta"]
      : [".hero__title", ".hero__cta", ".hero__eyebrow"];
    var heroItems = heroOrder
      .map(function (selector) { return document.querySelector(selector); })
      .filter(Boolean);

    gsap.from(heroItems, {
      y: 12,
      opacity: 0,
      duration: 0.72,
      stagger: 0.1,
      delay: 0.08,
      ease: "power2.out",
      clearProps: "transform,opacity"
    });

    gsap.from(".product", {
      y: 16,
      opacity: 0,
      duration: 0.72,
      stagger: 0.12,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: "#collection",
        start: "top 76%",
        once: true
      }
    });

    if (document.querySelector("#philosophy")) {
      gsap.from(".ingredient-card", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#philosophy",
          start: "top 76%",
          once: true
        }
      });
    }

    if (document.querySelector("#anatomy")) {
      gsap.from(".phase-card", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#anatomy",
          start: "top 76%",
          once: true
        }
      });
    }

    if (document.querySelector("#rituals")) {
      gsap.from(".rituals__header, .rituals__controls", {
        y: 14,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#rituals",
          start: "top 78%",
          once: true
        }
      });
    }

    gsap.from([".ritual-moment__visual", ".ritual-moment__copy > *"], {
      y: 14,
      opacity: 0,
      duration: 0.72,
      stagger: 0.09,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: "#ritual-moment",
        start: "top 76%",
        once: true
      }
    });

    if (document.querySelector("#packaging")) {
      gsap.from(".packaging-item", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#packaging",
          start: "top 76%",
          once: true
        }
      });
    }

    if (document.querySelector("#journal")) {
      gsap.from(".journal-card", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: "#journal",
          start: "top 76%",
          once: true
        }
      });
    }

    gsap.from([".questions__title", ".question"], {
      y: 10,
      opacity: 0,
      duration: 0.62,
      stagger: 0.07,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: "#questions",
        start: "top 80%",
        once: true
      }
    });

    gsap.from(".closing__inner > *", {
      y: 12,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: "#closing",
        start: "top 80%",
        once: true
      }
    });
  } catch (error) {
    document.documentElement.dataset.motionFallback = "true";
  }
})();
