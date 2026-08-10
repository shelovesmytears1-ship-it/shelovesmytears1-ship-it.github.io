document.addEventListener('DOMContentLoaded', () => {
  // Navigation Scroll Effect
  const header = document.querySelector('.nav-header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        // Account for fixed header height
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const burgerMenu = document.querySelector('.burger-menu');
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          burgerMenu.classList.remove('active');
          header.classList.remove('menu-open');
          document.body.classList.remove('menu-open');
          burgerMenu.setAttribute('aria-expanded', 'false');
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile Menu Toggle
  const burgerBtn = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-links');

  if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
      burgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      header.classList.toggle('menu-open');
      const isOpen = navMenu.classList.contains('active');
      document.body.classList.toggle('menu-open', isOpen);
      burgerBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }
});
