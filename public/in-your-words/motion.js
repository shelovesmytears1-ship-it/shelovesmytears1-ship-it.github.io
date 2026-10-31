(() => {
  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  if (!gsap || !ScrollTrigger || !SplitText) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);
  const media = gsap.matchMedia();

  media.add("(prefers-reduced-motion: no-preference)", () => {
    const splits = [];
    const cleanups = [];
    const liveTweens = new Set();
    const header = document.querySelector(".site-header");
    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".hero__title");
    const photo = document.querySelector(".hero-visual__portrait");
    const notebook = document.querySelector(".notebook-preview");
    const progress = document.querySelector("[data-reading-progress]");
    const navLinks = Array.from(document.querySelectorAll("#site-navigation a"));
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navTargets = navLinks.map((link) => ({ link, section: document.getElementById(decodeURIComponent(link.hash.slice(1))) }))
      .filter((entry) => entry.section);

    const keepTween = (tween) => {
      liveTweens.add(tween);
      const onComplete = tween.eventCallback("onComplete");
      tween.eventCallback("onComplete", function () {
        try {
          if (onComplete) onComplete.apply(this, arguments);
        } finally {
          liveTweens.delete(tween);
        }
      });
      return tween;
    };

    const revealHeading = (element, options = {}) => {
      let hasRevealed = false;
      const split = SplitText.create(element, {
        type: "lines,words",
        mask: "lines",
        linesClass: "motion-line",
        wordsClass: "motion-word",
        aria: "auto",
        autoSplit: true,
        onSplit(self) {
          if (hasRevealed) {
            self.revert();
            return;
          }
          const tween = gsap.from(self.words, {
            yPercent: 112,
            autoAlpha: 0,
            duration: options.duration || 0.78,
            stagger: options.stagger || 0.035,
            delay: options.delay || 0,
            ease: "power4.out",
            ...(options.scroll ? {
              scrollTrigger: {
                trigger: element,
                start: options.start || "top 83%",
                once: true
              }
            } : {})
          });
          tween.eventCallback("onComplete", () => {
            hasRevealed = true;
            self.revert();
          });
          return keepTween(tween);
        }
      });
      splits.push(split);
    };

    // Hero choreography: editorial masthead, masked type, image wipe, then the decision points.
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTimeline
      .from(".brand__name", { y: -18, autoAlpha: 0, duration: 0.48 }, 0)
      .from(".brand__rule", { scaleX: 0, transformOrigin: "left center", duration: 0.42 }, 0.18)
      .from(".site-nav__link", { y: -8, autoAlpha: 0, duration: 0.36, stagger: 0.045 }, 0.16)
      .from(".header-note", { x: 12, autoAlpha: 0, duration: 0.42 }, 0.22)
      .from(".hero__copy .eyebrow", { y: 12, autoAlpha: 0, duration: 0.45 }, 0.2)
      .from(".hero__intro p, .hero__helper", { y: 12, autoAlpha: 0, duration: 0.46, stagger: 0.11 }, 0.78)
      .from(photo, {
        clipPath: "inset(0 100% 0 0 round 14rem 0 0 0)",
        scale: 1.045,
        duration: 1.08,
        ease: "power4.out",
        clearProps: "clipPath,scale"
      }, 0.19)
      .from(".hero-visual__caption", { y: 12, autoAlpha: 0, duration: 0.46 }, 0.88)
      .from(notebook, { y: 22, x: -8, rotation: -1.5, autoAlpha: 0, duration: 0.65, ease: "back.out(1.25)" }, 0.8)
      .from(".hero__actions > *", { y: 14, autoAlpha: 0, duration: 0.44, stagger: 0.1 }, 0.96);
    keepTween(heroTimeline);
    if (heroTitle) revealHeading(heroTitle, { delay: 0.22, duration: 0.86, stagger: 0.027 });

    // Distinct reveal tempos preserve the editorial rhythm as each section enters.
    document.querySelectorAll("main section[id]")
      .forEach((section) => {
        const kicker = section.querySelector(".section-kicker");
        if (kicker) {
          keepTween(gsap.from(kicker, {
            x: -14,
            autoAlpha: 0,
            duration: 0.48,
            ease: "power2.out",
            scrollTrigger: { trigger: kicker, start: "top 87%", once: true }
          }));
        }
        const title = section.querySelector(".section-title");
        if (title) revealHeading(title, { scroll: true, duration: 0.72, stagger: 0.025 });
      });

    keepTween(gsap.from(".lesson-lab__lead", {
      y: 16, autoAlpha: 0, duration: 0.6,
      scrollTrigger: { trigger: ".lesson-lab__lead", start: "top 88%", once: true }
    }));
    keepTween(gsap.from(".lesson-steps li", {
      x: -12, autoAlpha: 0, duration: 0.52, stagger: 0.1,
      scrollTrigger: { trigger: ".lesson-steps", start: "top 84%", once: true }
    }));
    keepTween(gsap.from(".lesson-demo", {
      y: 22, autoAlpha: 0, duration: 0.7, ease: "power3.out",
      scrollTrigger: { trigger: ".lesson-demo", start: "top 85%", once: true }
    }));

    const aboutFigure = document.querySelector(".adam-photo");
    const aboutClip = document.querySelector(".adam-photo__clip");
    const aboutImage = aboutClip?.querySelector("img");
    if (aboutClip && aboutImage) {
      keepTween(gsap.fromTo(aboutClip,
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.95,
          ease: "power3.inOut",
          clearProps: "clipPath",
          scrollTrigger: { trigger: aboutFigure, start: "top 78%", once: true }
        }
      ));
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.set(aboutImage, { scale: 1.08 });
        keepTween(gsap.to(aboutImage, {
          yPercent: 3.5,
          ease: "none",
          scrollTrigger: {
            trigger: aboutFigure,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6
          }
        }));
      }
    }

    keepTween(gsap.from(".adam-copy__thought, .adam-method__title, .adam-copy > p:not(.section-kicker):not(.adam-copy__thought)", {
      y: 16, autoAlpha: 0, duration: 0.58, stagger: 0.12,
      scrollTrigger: { trigger: ".adam-copy__thought", start: "top 82%", once: true }
    }));
    keepTween(gsap.from(".roadmap-step", {
      y: 12, autoAlpha: 0, duration: 0.42, stagger: 0.07,
      scrollTrigger: { trigger: ".roadmap-steps", start: "top 84%", once: true }
    }));
    keepTween(gsap.from(".roadmap-panel", {
      y: 18, autoAlpha: 0, duration: 0.58, ease: "power3.out",
      scrollTrigger: { trigger: ".roadmap-panel", start: "top 84%", once: true }
    }));
    keepTween(gsap.from(".format-row", {
      x: -14, autoAlpha: 0, duration: 0.52, stagger: 0.12,
      scrollTrigger: { trigger: ".format-list", start: "top 83%", once: true }
    }));
    keepTween(gsap.from(".faq-item", {
      x: 16, autoAlpha: 0, duration: 0.45, stagger: 0.075,
      scrollTrigger: { trigger: ".faq-list", start: "top 82%", once: true }
    }));
    keepTween(gsap.from(".contact-copy > p, .contact-copy h2, .contact-form .form-field, .contact-form__submit", {
      y: 14, autoAlpha: 0, duration: 0.48, stagger: 0.08,
      scrollTrigger: { trigger: ".contact-section", start: "top 78%", once: true }
    }));

    // Tabs update content and ARIA synchronously in app.js; motion only follows that event.
    const lessonPanel = document.querySelector("#lesson-panel");
    let panelTween = null;
    const onScenarioChange = () => {
      if (!lessonPanel) return;
      panelTween?.kill();
      panelTween = gsap.fromTo(lessonPanel,
        { autoAlpha: 0, y: 6 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          overwrite: true
        }
      );
      keepTween(panelTween);
    };
    window.addEventListener("scenariochange", onScenarioChange);
    cleanups.push(() => window.removeEventListener("scenariochange", onScenarioChange));

    const onContentPanelChange = (event) => {
      const selector = event.detail?.selector;
      const panel = selector && document.querySelector(selector);
      if (!panel || panel.hidden) return;
      const tween = gsap.fromTo(panel,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "opacity,visibility,transform", overwrite: true }
      );
      keepTween(tween);
    };
    window.addEventListener("contentpanelchange", onContentPanelChange);
    cleanups.push(() => window.removeEventListener("contentpanelchange", onContentPanelChange));

    let contentRefreshFrame = 0;
    const onContentResize = () => {
      if (contentRefreshFrame) return;
      contentRefreshFrame = requestAnimationFrame(() => {
        contentRefreshFrame = 0;
        ScrollTrigger.refresh();
      });
    };
    window.addEventListener("contentresize", onContentResize);
    cleanups.push(() => {
      window.removeEventListener("contentresize", onContentResize);
      if (contentRefreshFrame) cancelAnimationFrame(contentRefreshFrame);
    });

    // Pointer depth is deliberately tiny and unavailable to coarse/touch pointers.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (finePointer) {
      const magneticButtons = Array.from(document.querySelectorAll(".button--primary"));
      const buttonHandlers = new Map();
      const resetButton = (button) => gsap.to(button, {
        x: 0, y: 0, duration: 0.34, ease: "power3.out", overwrite: "auto"
      });
      magneticButtons.forEach((button) => {
        const onMove = (event) => {
          const bounds = button.getBoundingClientRect();
          const x = gsap.utils.clamp(-4, 4, (event.clientX - (bounds.left + bounds.width / 2)) * 0.07);
          const y = gsap.utils.clamp(-3, 3, (event.clientY - (bounds.top + bounds.height / 2)) * 0.07);
          gsap.to(button, { x, y, duration: 0.24, ease: "power2.out", overwrite: "auto" });
        };
        const onReset = () => resetButton(button);
        buttonHandlers.set(button, { onMove, onReset });
        button.addEventListener("pointermove", onMove, { passive: true });
        button.addEventListener("pointerleave", onReset);
        button.addEventListener("focus", onReset);
        button.addEventListener("blur", onReset);
      });

      if (hero && notebook) {
        const onHeroMove = (event) => {
          const note = notebook.getBoundingClientRect();
          const nearNote = event.clientX >= note.left - 60 && event.clientX <= note.right + 60 &&
            event.clientY >= note.top - 60 && event.clientY <= note.bottom + 60;
          gsap.to(notebook, {
            x: nearNote ? gsap.utils.clamp(-4, 4, (event.clientX - (note.left + note.width / 2)) * 0.045) : 0,
            y: nearNote ? gsap.utils.clamp(-4, 4, (event.clientY - (note.top + note.height / 2)) * 0.045) : 0,
            duration: 0.42,
            ease: "power3.out",
            overwrite: "auto"
          });
        };
        const onHeroLeave = () => gsap.to(notebook, {
          x: 0, y: 0, duration: 0.42, ease: "power3.out", overwrite: "auto"
        });
        hero.addEventListener("pointermove", onHeroMove, { passive: true });
        hero.addEventListener("pointerleave", onHeroLeave);
        cleanups.push(() => {
          hero.removeEventListener("pointermove", onHeroMove);
          hero.removeEventListener("pointerleave", onHeroLeave);
        });
      }

      cleanups.push(() => {
        magneticButtons.forEach((button) => {
          const handlers = buttonHandlers.get(button);
          button.removeEventListener("pointermove", handlers.onMove);
          button.removeEventListener("pointerleave", handlers.onReset);
          button.removeEventListener("focus", handlers.onReset);
          button.removeEventListener("blur", handlers.onReset);
        });
        gsap.killTweensOf([notebook, ...magneticButtons]);
        gsap.set([notebook, ...magneticButtons], { clearProps: "transform" });
      });
    }

    // Measured FAQ expansion keeps native details semantics and responds to rapid toggles.
    const faqRecords = Array.from(document.querySelectorAll(".faq-item")).map((details) => ({
      details,
      answer: details.querySelector(".faq-answer"),
      state: details.open ? "open" : "closed",
      tween: null,
      onClick: null
    }));

    const resetAnswer = (record) => {
      gsap.set(record.answer, { clearProps: "height,overflow,opacity,visibility" });
    };

    const openFaq = (record) => {
      const currentHeight = record.answer.getBoundingClientRect().height;
      record.tween?.kill();
      record.details.open = true;
      record.state = "opening";
      gsap.set(record.answer, {
        height: currentHeight > 0 ? currentHeight : 0,
        overflow: "hidden",
        autoAlpha: currentHeight > 0 ? 1 : 0
      });
      record.tween = gsap.to(record.answer, {
        height: record.answer.scrollHeight,
        autoAlpha: 1,
        duration: 0.42,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          resetAnswer(record);
          record.state = "open";
          record.tween = null;
          ScrollTrigger.refresh();
        }
      });
      keepTween(record.tween);
    };

    const closeFaq = (record) => {
      const currentHeight = record.answer.getBoundingClientRect().height;
      record.tween?.kill();
      record.state = "closing";
      gsap.set(record.answer, { height: currentHeight, overflow: "hidden", autoAlpha: 1 });
      record.tween = gsap.to(record.answer, {
        height: 0,
        autoAlpha: 0,
        duration: 0.32,
        ease: "power2.inOut",
        overwrite: true,
        onComplete: () => {
          record.details.open = false;
          resetAnswer(record);
          record.state = "closed";
          record.tween = null;
          ScrollTrigger.refresh();
        }
      });
      keepTween(record.tween);
    };

    faqRecords.forEach((record) => {
      record.onClick = (event) => {
        if (!event.target.closest("summary")) return;
        event.preventDefault();
        if (record.state === "closing") openFaq(record);
        else if (record.details.open) closeFaq(record);
        else openFaq(record);
      };
      record.details.addEventListener("click", record.onClick);
    });

    const onFaqResize = () => {
      faqRecords.forEach((record) => {
        if (record.state !== "opening" && record.state !== "closing") return;
        record.tween?.kill();
        if (record.state === "closing") record.details.open = false;
        resetAnswer(record);
        record.state = record.details.open ? "open" : "closed";
        record.tween = null;
      });
    };
    window.addEventListener("resize", onFaqResize, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("resize", onFaqResize);
      faqRecords.forEach((record) => {
        record.details.removeEventListener("click", record.onClick);
        record.tween?.kill();
        if (record.state === "closing") record.details.open = false;
        resetAnswer(record);
      });
    });

    // A valid demo form previews locally; app.js owns validation and textContent rendering.
    const contactForm = document.querySelector("#contact-form");
    const formPreview = document.querySelector("#form-preview");
    let formLayoutFrame = 0;
    const onFormInput = () => {
      if (formLayoutFrame) cancelAnimationFrame(formLayoutFrame);
      formLayoutFrame = requestAnimationFrame(() => {
        formLayoutFrame = 0;
        ScrollTrigger.refresh();
      });
    };
    contactForm?.addEventListener("input", onFormInput);
    cleanups.push(() => {
      if (formLayoutFrame) cancelAnimationFrame(formLayoutFrame);
      contactForm?.removeEventListener("input", onFormInput);
    });
    const onFormSubmit = () => {
      requestAnimationFrame(() => {
        if (formPreview.hidden) return;
        const tween = gsap.fromTo(formPreview,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.42,
            ease: "power2.out",
            clearProps: "opacity,visibility,transform",
            onComplete: () => ScrollTrigger.refresh()
          }
        );
        keepTween(tween);
      });
    };
    contactForm?.addEventListener("submit", onFormSubmit);
    cleanups.push(() => contactForm?.removeEventListener("submit", onFormSubmit));

    // Fine-pointer desktop gets Lenis wheel smoothing; touch keeps native scrolling.
    let lenis = null;
    let ticker = null;
    let anchorClick = null;
    let popState = null;
    const canUseLenis = finePointer && typeof Lenis === "function";

    if (canUseLenis) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (value) => 1 - Math.pow(1 - value, 4),
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 0.92
      });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      // Keep Lenis' target in sync when a reload resets the native scroll position.
      const onPageStartReset = () => lenis.scrollTo(0, { immediate: true, force: true });
      window.addEventListener('pagestartreset', onPageStartReset);
      cleanups.push(() => window.removeEventListener('pagestartreset', onPageStartReset));

      const scrollToHash = (target, immediate = false) => {
        target.focus?.({ preventScroll: true });
        lenis.scrollTo(target, {
          offset: -(header.getBoundingClientRect().height + 16),
          duration: immediate ? 0 : 1.2,
          easing: (value) => 1 - Math.pow(1 - value, 4),
          immediate
        });
      };

      anchorClick = (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target.closest('a[href^="#"]');
        if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        const hash = anchor.getAttribute("href");
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        if (window.location.hash !== hash) history.pushState({ motionAnchor: true }, "", hash);
        scrollToHash(target);
      };
      document.addEventListener("click", anchorClick);

      popState = () => {
        const hash = window.location.hash;
        const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : document.getElementById("top");
        if (target) scrollToHash(target, true);
      };
      window.addEventListener("popstate", popState);
    }

    const setCurrentNav = () => {
      const marker = window.innerHeight * 0.34;
      let currentSectionIndex = -1;
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= marker) currentSectionIndex = sections.indexOf(section);
      });
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      let activeLink = null;
      navTargets.forEach((entry) => {
        if (sections.indexOf(entry.section) <= currentSectionIndex) activeLink = entry.link;
      });
      if (maxScroll - window.scrollY <= 2) activeLink = navTargets.find((entry) => entry.section.id === "kontakt")?.link || activeLink;
      navLinks.forEach((link) => {
        if (link === activeLink) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    if (progress) {
      keepTween(gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true }
      }));
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: setCurrentNav,
        onRefresh: setCurrentNav
      });
    }

    document.fonts?.ready?.then(() => {
      if (document.documentElement.isConnected) ScrollTrigger.refresh();
    });

    cleanups.push(() => {
      if (anchorClick) document.removeEventListener("click", anchorClick);
      if (popState) window.removeEventListener("popstate", popState);
      if (ticker) gsap.ticker.remove(ticker);
      if (lenis) {
        lenis.off?.("scroll", ScrollTrigger.update);
        lenis.destroy();
      }
      liveTweens.forEach((tween) => tween.kill());
      liveTweens.clear();
      splits.forEach((split) => split.revert());
      gsap.set([
        photo,
        notebook,
        progress,
        ...navLinks,
        document.querySelector("#lesson-panel"),
        document.querySelector("#roadmap-panel"),
        document.querySelector("#form-preview"),
        document.querySelector(".adam-photo__clip img")
      ].filter(Boolean), { clearProps: "all" });
      gsap.ticker.lagSmoothing(500, 33);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
})();
