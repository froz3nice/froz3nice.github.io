const userLang = navigator.language || navigator.userLanguage;
if (!window.location.pathname.startsWith('/lt') && !window.location.pathname.startsWith('/en')) {
    if (userLang.startsWith('lt')) {
        window.location.replace('/lt/');
    } else {
        window.location.replace('/en/');
    }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Navbar state + scroll progress
const navbar = document.querySelector('.navbar');
const progress = document.querySelector('.scroll-progress');

function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Highlight the nav link of the section in view
const navAnchors = [...navLinks.querySelectorAll('a[href^="#"]')];
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
    });
}, { rootMargin: '-45% 0px -50% 0px' });

navAnchors.forEach(a => {
    const section = document.querySelector(a.getAttribute('href'));
    if (section) sectionObserver.observe(section);
});

// Language switcher
const languageSwitch = document.getElementById('languageSwitch');
const languageDropdown = document.getElementById('languageDropdown');

languageSwitch.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSwitch.classList.toggle('active');
    languageDropdown.classList.toggle('active');
});

document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = option.dataset.url;
    });
});

document.addEventListener('click', () => {
    languageSwitch.classList.remove('active');
    languageDropdown.classList.remove('active');
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .section-head, .services-timeline, [data-stagger]').forEach(el => {
    revealObserver.observe(el);
});

// Children of [data-stagger] reveal one after another
document.querySelectorAll('[data-stagger]').forEach(group => {
    [...group.children].forEach((child, i) => {
        if (child.classList.contains('hidden-item')) return;
        child.classList.add('reveal');
        child.style.setProperty('--d', `${i * 0.1}s`);
        revealObserver.observe(child);
    });
});

// Animated counters
function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    if (reduceMotion) {
        el.textContent = target.toFixed(decimals);
        return;
    }
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = (target * eased).toFixed(decimals);
        if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// Typing word rotator in hero
const rotator = document.querySelector('.hero-rotator .word');
if (rotator) {
    const words = JSON.parse(rotator.dataset.words);
    if (reduceMotion) {
        rotator.textContent = words.join(' · ');
    } else {
        let wordIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const word = words[wordIndex];
            charIndex += deleting ? -1 : 1;
            rotator.textContent = word.slice(0, charIndex);

            let delay = deleting ? 45 : 90;
            if (!deleting && charIndex === word.length) {
                delay = 1800;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                delay = 350;
            }
            setTimeout(type, delay);
        }
        setTimeout(type, 1200);
    }
}

// Cursor spotlight on project cards
document.querySelectorAll('.portfolio-item').forEach(card => {
    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
});

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    item.addEventListener('click', () => {
        faqItems.forEach(i => {
            if (i !== item) i.classList.remove('active');
        });
        item.classList.toggle('active');
    });
});

// Show more projects
const showMoreBtn = document.getElementById('show-more-btn');
const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-item');
let isExpanded = false;

if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        isExpanded = !isExpanded;
        hiddenItems.forEach((item, index) => {
            item.classList.toggle('hidden-item', !isExpanded);
            item.classList.toggle('show-animation', isExpanded);
            item.style.animationDelay = isExpanded ? `${index * 0.08}s` : '';
        });
        showMoreBtn.querySelector('span').textContent = isExpanded ? showMoreBtn.dataset.less : showMoreBtn.dataset.more;
        showMoreBtn.querySelector('i').className = isExpanded ? 'fas fa-arrow-up' : 'fas fa-arrow-down';

        if (!isExpanded) {
            document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Fullscreen image modal
const modal = document.getElementById('fullscreenModal');
const modalImg = document.getElementById('modalImg');

function closeModal() {
    modal.classList.remove('open');
}

if (modal) {
    document.querySelectorAll('.clickable-image').forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modalImg.alt = img.alt;
            modal.classList.add('open');
        });
    });

    document.getElementById('closeModal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Footer year
document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
});
