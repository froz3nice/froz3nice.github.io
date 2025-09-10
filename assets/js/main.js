const userLang = navigator.language || navigator.userLanguage;
if (!window.location.pathname.startsWith('/lt') && !window.location.pathname.startsWith('/en')) {
    if (userLang.startsWith('lt')) {
        window.location.replace('/lt/');
    } else {
        window.location.replace('/en/');
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.9)';
    }
});

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and tech items
document.querySelectorAll('.service-card, .tech-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

const showMoreBtn = document.getElementById('show-more-btn');
const hiddenItems = document.querySelectorAll('.portfolio-item.hidden-item');
let isExpanded = false;

function addImageClickListener(img) {
    const modal = document.getElementById('fullscreenModal');
    const modalImg = document.getElementById('modalImg');
    img.addEventListener('click', () => {
        console.log('Image clicked:', img.src);
        modal.style.display = 'flex';
        modalImg.src = img.src;
    });
}

// On DOMContentLoaded, attach to all visible images
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('fullscreenModal');
    const closeBtn = document.getElementById('closeModal');

    document.querySelectorAll('.clickable-image').forEach(img => {
        addImageClickListener(img);
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Click outside image to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});

if (showMoreBtn) {
    showMoreBtn.addEventListener('click', function () {
        if (!isExpanded) {
            // Show hidden items with animation
            hiddenItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'block';
                    item.classList.remove('hidden-item');
                    item.classList.add('show-animation');

                    // Add click listener for images in newly shown items
                    const clickableImage = item.querySelector('.clickable-image');
                    if (clickableImage) {
                        // addImageClickListener(clickableImage);
                    }
                }, index * 100);
            });

            showMoreBtn.textContent = 'Show Less';
            isExpanded = true;
        } else {
            // Hide items
            hiddenItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.display = 'none';
                    item.classList.add('hidden-item');
                    item.classList.remove('show-animation');
                }, index * 50);
            });

            showMoreBtn.textContent = 'Show More';
            isExpanded = false;

            // Scroll back to top of portfolio section
            document.getElementById('portfolio').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Collapse menu when any nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Language switch
// On page load, set language selector to current path
const languageSelect = document.getElementById('languageSwitch');
const currentPath = window.location.pathname;

if (currentPath.startsWith('/lt/')) {
    languageSelect.value = '/lt/';
} else {
    languageSelect.value = '/en/';
}

// On change, navigate to selected language
languageSelect.addEventListener('change', () => {
    window.location.href = languageSelect.value;
});

// Language switcher functionality
const languageSwitch = document.getElementById('languageSwitch');
const languageDropdown = document.getElementById('languageDropdown');
const currentLanguage = document.querySelector('.current-language');
const languageOptions = document.querySelectorAll('.language-option');

languageSwitch.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSwitch.classList.toggle('active');
    languageDropdown.classList.toggle('active');
});

// Handle language selection
languageOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();

        // Remove selected class from all options
        languageOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selected class to clicked option
        option.classList.add('selected');

        // Update current language display
        const langCode = option.dataset.lang.toUpperCase();
        const langName = option.textContent.trim();

        // Close dropdown
        languageSwitch.classList.remove('active');
        languageDropdown.classList.remove('active');

        // Close mobile menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        console.log(languageSelect.value);
        // Here you would typically redirect to the new language URL
        window.location.href = option.dataset.url;
        currentLanguage.textContent = langCode;

        console.log(`Language switched to: ${langName} (${option.dataset.url})`);
    });
});



