document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Impact Stats Counter Animation
    const statsSection = document.querySelector('.impact');
    const statNumbers = document.querySelectorAll('.stat-number');
    let started = false; // Function started ? No

    function startCount(el) {
        const target = parseInt(el.dataset.target);
        const count = +el.innerText;
        const increment = target / 200; // Adjust speed

        if (count < target) {
            el.innerText = Math.ceil(count + increment);
            setTimeout(() => startCount(el), 10);
        } else {
            el.innerText = target + "+"; // Add + sign for impact
        }
    }

    // Intersection Observer for Stats
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                statNumbers.forEach(num => startCount(num));
                started = true;
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Scroll Animation for Elements (Fade Up)
    const fadeElements = document.querySelectorAll('.about-card, .section-header');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        fadeObserver.observe(el);
    });

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        let currentSlideIndex = 0;

        function moveToSlide(index) {
            track.style.transform = 'translateX(-' + (index * 100) + '%)';
            currentSlideIndex = index;
        }

        function nextSlide() {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            moveToSlide(nextIndex);
        }

        // Auto slide every 3 seconds
        setInterval(nextSlide, 3000);
    }
});
