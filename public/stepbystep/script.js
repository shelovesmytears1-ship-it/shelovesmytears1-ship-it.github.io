document.addEventListener("DOMContentLoaded", function () {

    /* ---------- 1. Dynamic year ---------- */
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- 2. Navbar shrink on scroll ---------- */
    const navbar = document.querySelector(".navbar");
    function onScroll() {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---------- 3. Mobile burger menu + backdrop ---------- */
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    const backdrop = document.getElementById("nav-backdrop");

    function setMenu(open) {
        if (!navToggle || !navLinks) return;
        navToggle.setAttribute("aria-expanded", String(open));
        navToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
        navLinks.classList.toggle("open", open);
        if (backdrop) backdrop.classList.toggle("open", open);
        document.body.style.overflow = open ? "hidden" : "";
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            setMenu(navToggle.getAttribute("aria-expanded") !== "true");
        });
        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () { setMenu(false); });
        });
    }
    if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });

    /* ---------- 4. Smooth scroll for anchor links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ---------- 5. Scroll-spy: highlight active nav link ---------- */
    const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));
    const sections = spyLinks
        .map(function (a) { return document.querySelector(a.getAttribute("href")); })
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {
        const spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    spyLinks.forEach(function (a) {
                        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
                    });
                }
            });
        }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- 6. Accordions (services + FAQ) — one handler ---------- */
    document.querySelectorAll(".accordion-btn, .faq-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const panel = document.getElementById(btn.getAttribute("aria-controls"));
            if (!panel) return;
            const isOpen = btn.getAttribute("aria-expanded") === "true";

            const group = btn.closest(".services-grid, .faq-container");
            if (group && !isOpen) {
                group.querySelectorAll(".accordion-btn, .faq-btn").forEach(function (other) {
                    if (other !== btn && other.getAttribute("aria-expanded") === "true") {
                        other.setAttribute("aria-expanded", "false");
                        const op = document.getElementById(other.getAttribute("aria-controls"));
                        if (op) op.style.maxHeight = "0px";
                    }
                });
            }

            if (isOpen) {
                btn.setAttribute("aria-expanded", "false");
                panel.style.maxHeight = "0px";
            } else {
                btn.setAttribute("aria-expanded", "true");
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    /* ---------- 7. Diploma modal (accessible) ---------- */
    const modal = document.getElementById("image-modal");
    const diplomaBtn = document.getElementById("diploma-btn");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".close-modal");
    let lastFocused = null;

    function openModal() {
        if (!modal || !diplomaBtn) return;
        lastFocused = document.activeElement;
        modalImg.src = diplomaBtn.querySelector("img").src;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("open");
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    if (diplomaBtn) {
        diplomaBtn.addEventListener("click", openModal);
        diplomaBtn.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal();
            }
        });
    }
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (modal && modal.classList.contains("open")) closeModal();
            if (navLinks && navLinks.classList.contains("open")) setMenu(false);
        }
    });

    
    /* ---------- 8. Interactive Quiz Engine ---------- */
    const quizState = { who: '', format: '', level: '' };
    const stepBars = [
        document.getElementById('q-step-bar-1'),
        document.getElementById('q-step-bar-2'),
        document.getElementById('q-step-bar-3')
    ];
    const stepPanes = {
        '1': document.getElementById('quiz-step-1'),
        '2': document.getElementById('quiz-step-2'),
        '3': document.getElementById('quiz-step-3'),
        'result': document.getElementById('quiz-step-result')
    };

    function showQuizStep(stepId) {
        Object.keys(stepPanes).forEach(k => {
            if (stepPanes[k]) stepPanes[k].style.display = (k === stepId) ? 'block' : 'none';
        });

        if (stepId === '1') {
            if (stepBars[0]) stepBars[0].classList.add('active');
            if (stepBars[1]) stepBars[1].classList.remove('active');
            if (stepBars[2]) stepBars[2].classList.remove('active');
        } else if (stepId === '2') {
            if (stepBars[1]) stepBars[1].classList.add('active');
            if (stepBars[2]) stepBars[2].classList.remove('active');
        } else if (stepId === '3' || stepId === 'result') {
            if (stepBars[1]) stepBars[1].classList.add('active');
            if (stepBars[2]) stepBars[2].classList.add('active');
        }

        if (stepId === 'result') {
            calculateQuizResult();
        }
    }

    function calculateQuizResult() {
        const resTitle = document.getElementById('quiz-res-title');
        const resDesc = document.getElementById('quiz-res-desc');
        const resFormat = document.getElementById('quiz-res-format');
        let recProgram = 'Польский для детей (6+)';

        if (quizState.who === 'special') {
            recProgram = 'Особые потребности (ОПП)';
            if (resTitle) resTitle.textContent = 'Особые образовательные потребности (ОПП)';
            if (resDesc) resDesc.textContent = 'Индивидуальная сенсорная и развивающая поддержка для детей с аутизмом, ЗПР и нарушениями зрения от квалифицированного олигофренопедагога.';
        } else if (quizState.who === 'adult') {
            recProgram = 'Польский для подростков/взрослых';
            if (resTitle) resTitle.textContent = 'Польский для подростков и взрослых';
            if (resDesc) resDesc.textContent = 'Практический разговорный польский без зубрежки и стресса: для школы, работы, ужондов и свободной жизни в Польше.';
        } else if (quizState.who === 'prep' || quizState.level === 'school') {
            recProgram = 'Подготовка к школе';
            if (resTitle) resTitle.textContent = 'Комплексная подготовка к польской школе (0–3 класс)';
            if (resDesc) resDesc.textContent = 'Польский язык, базовый счёт, понимание инструкций польского учителя и снятие языкового барьера перед классом.';
        } else {
            recProgram = 'Польский для детей (6+)';
            if (resTitle) resTitle.textContent = 'Польский язык для детей (с 6 лет)';
            if (resDesc) resDesc.textContent = 'Увлекательное погружение в язык через дидактические игры, расширение словарного запаса и правильное произношение.';
        }

        if (resFormat) {
            resFormat.innerHTML = (quizState.format === 'offline') 
                ? '<i class="fa-solid fa-building-user"></i> Офлайн (Гданьск Stogi / с доездом)' 
                : '<i class="fa-solid fa-laptop-house"></i> Онлайн (Zoom / Google Meet)';
        }

        const applyBtn = document.getElementById('quiz-apply-btn');
        if (applyBtn) {
            applyBtn.onclick = function() {
                selectAndScrollToProgram(recProgram);
            };
        }
    }

    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = btn.getAttribute('data-key');
            const val = btn.getAttribute('data-val');
            const targetStep = btn.getAttribute('data-target-step');

            if (key) quizState[key] = val;
            showQuizStep(targetStep);
        });
    });

    const quizResetBtn = document.getElementById('quiz-reset-btn');
    if (quizResetBtn) {
        quizResetBtn.addEventListener('click', function() {
            quizState.who = ''; quizState.format = ''; quizState.level = '';
            showQuizStep('1');
        });
    }

    /* ---------- 9. Service & Pricing Selection to Form Bridge ---------- */
    function selectAndScrollToProgram(progName) {
        const progSelect = document.getElementById('program');
        if (progSelect) {
            for (let i = 0; i < progSelect.options.length; i++) {
                if (progSelect.options[i].value === progName || progSelect.options[i].text.includes(progName)) {
                    progSelect.selectedIndex = i;
                    break;
                }
            }
        }

        const contactSec = document.getElementById('contact');
        if (contactSec) {
            contactSec.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) nameInput.focus();
            }, 600);
        }
    }

    document.querySelectorAll('.select-service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const p = btn.getAttribute('data-program');
            if (p) selectAndScrollToProgram(p);
        });
    });

    document.querySelectorAll('.pricing-table tbody tr').forEach(row => {
        row.addEventListener('click', function() {
            const cat = row.querySelector('[data-label="Категория"]');
            if (cat) {
                const text = cat.textContent.trim();
                let matched = 'Пока не определились';
                if (text.includes('детей (6+)')) matched = 'Польский для детей (6+)';
                else if (text.includes('Подростки')) matched = 'Польский для подростков/взрослых';
                else if (text.includes('ООП')) matched = 'Особые потребности (ОПП)';
                else if (text.includes('Подготовка')) matched = 'Подготовка к школе';
                selectAndScrollToProgram(matched);
            }
        });
    });

    /* ---------- 10. Confirmation Modal & Form Submission ---------- */
    const bookingModal = document.getElementById('booking-modal');
    const closeBookingBtn = document.getElementById('close-booking-modal');
    const confirmNameEl = document.getElementById('confirm-name');
    const confirmProgEl = document.getElementById('confirm-prog');
    const confirmWaBtn = document.getElementById('confirm-wa-btn');
    const copyMsgBtn = document.getElementById('copy-msg-btn');
    let lastGeneratedMessage = '';

    function closeBookingModal() {
        if (bookingModal) {
            bookingModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    if (closeBookingBtn) closeBookingBtn.addEventListener('click', closeBookingModal);
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) closeBookingModal();
        });
    }

    if (copyMsgBtn) {
        copyMsgBtn.addEventListener('click', function() {
            if (lastGeneratedMessage) {
                navigator.clipboard.writeText(lastGeneratedMessage).then(() => {
                    copyMsgBtn.innerHTML = '<i class="fa-solid fa-check"></i> Текст скопирован!';
                    setTimeout(() => {
                        copyMsgBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Скопировать текст заявки';
                    }, 2000);
                });
            }
        });
    }

    const form = document.getElementById("lead-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const nameEl = document.getElementById("name");
            const hint = document.getElementById("form-hint");
            const name = nameEl.value.trim();

            if (!name) {
                nameEl.classList.add("invalid");
                nameEl.focus();
                if (hint) hint.textContent = "Пожалуйста, укажите имя.";
                return;
            }
            nameEl.classList.remove("invalid");

            const program = document.getElementById("program").value;
            const message = document.getElementById("message").value.trim();

            let text = "Здравствуйте! Меня зовут " + name + ".";
            text += "\nИнтересует программа: " + program + ".";
            if (message) text += "\nДетали: " + message;
            text += "\nХочу записаться на бесплатную консультацию-диагностику.";
            lastGeneratedMessage = text;

            const url = "https://wa.me/48782425330?text=" + encodeURIComponent(text);

            if (confirmNameEl) confirmNameEl.textContent = name;
            if (confirmProgEl) confirmProgEl.textContent = program;
            if (confirmWaBtn) confirmWaBtn.href = url;

            if (bookingModal) {
                bookingModal.classList.add('open');
                document.body.style.overflow = 'hidden';
            }

            if (hint) hint.textContent = "Заявка успешно подготовлена!";
        });
    }

/* ---------- 9. Scroll reveal (with light stagger) ---------- */
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
        const io = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Stagger siblings within the same grid/flex group
                    const parent = entry.target.parentElement;
                    const siblings = parent ? Array.from(parent.querySelectorAll(":scope > .reveal")) : [];
                    const idx = siblings.indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx > 0 ? idx * 0.08 : 0) + "s";
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add("visible"); });
    }
});
