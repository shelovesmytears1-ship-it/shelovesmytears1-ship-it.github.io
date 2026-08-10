document.addEventListener('DOMContentLoaded', () => {

    // 1. Calculator Logic
    const areaInput = document.getElementById('area');
    const areaVal = document.getElementById('area-val');
    const typeInputs = document.querySelectorAll('input[name="type"]');
    const totalPriceEl = document.getElementById('total-price');

    if(areaInput) {
        function calculate() {
            const area = parseInt(areaInput.value);
            let pricePerSqm = 0;
            
            typeInputs.forEach(input => {
                if(input.checked) pricePerSqm = parseInt(input.value);
            });

            const total = area * pricePerSqm;
            totalPriceEl.textContent = total.toLocaleString('pl-PL') + ' zł';
            areaVal.textContent = area;
        }

        areaInput.addEventListener('input', calculate);
        typeInputs.forEach(input => input.addEventListener('change', calculate));
        calculate(); 
    }

    // 2. Before / After Slider Logic
    const baContainer = document.querySelector('.ba-container');
    if (baContainer) {
        const baSlider = baContainer.querySelector('.ba-slider');
        const baBefore = baContainer.querySelector('.ba-before');
        
        let isDragging = false;

        function updateSlider(e) {
            if (!isDragging) return;
            
            const bounds = baContainer.getBoundingClientRect();
            let x;
            
            // support mouse and touch events
            if (e.type.includes('mouse')) {
                x = e.clientX - bounds.left;
            } else if (e.type.includes('touch')) {
                x = e.touches[0].clientX - bounds.left;
            }
            
            // Constrain within bounds
            x = Math.max(0, Math.min(x, bounds.width));
            const percentage = (x / bounds.width) * 100;
            
            baSlider.style.left = percentage + '%';
            baBefore.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        }

        baContainer.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', updateSlider);

        baContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            // prevent scrolling on mobile to slide smoothly
            if(e.cancelable) e.preventDefault();
        }, { passive: false });
        
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (isDragging && e.cancelable) e.preventDefault();
            updateSlider(e);
        }, { passive: false });
    }

    // 3. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all others
            faqItems.forEach(i => {
                if(i !== item) i.classList.remove('open');
            });
            // Toggle current
            item.classList.toggle('open');
        });
    });

    // 4. Form Submission (mock logic)
    const form = document.getElementById('lead-form');
    const successMsg = document.getElementById('success-msg');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            form.style.display = 'none';
            // Hide the text p tag in form card
            const p = document.querySelector('.form-card > p');
            if(p) p.style.display = 'none';
            
            successMsg.style.display = 'block';
        });
    }

    // 5. Smooth scroll
    const scrollBtns = document.querySelectorAll('[data-scroll]');
    scrollBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-scroll');
            if (targetId.startsWith('#')) {
                e.preventDefault(); // only prevent default if it's an anchor jump
                const targetEl = document.querySelector(targetId);
                if(targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 6. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                const staggers = entry.target.querySelectorAll('.stagger-up');
                staggers.forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    document.querySelectorAll('.stagger-up').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});
