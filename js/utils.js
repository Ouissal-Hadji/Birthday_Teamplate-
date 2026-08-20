/**
 * Utility functions used across the entire experience
 */

// Smooth scroll to element
function scrollToElement(selector) {
    const el = document.querySelector(selector);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Intersection Observer helper for scroll reveal animations
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
}

// Add reveal class to elements that should animate on scroll
function autoReveal() {
    const selectors = [
        '.section-header',
        '.gallery-item',
        '.letter',
        '.vinyl-record',
        '.music-embed',
        '.wish-card',
        '.game-board'
    ];

    selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
            el.classList.add('reveal');
        });
    });

    initRevealAnimations();
}

// Format seconds to MM:SS
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Check if user came through the gate (sessionStorage)
function isUnlocked() {
    return sessionStorage.getItem('birthdayUnlocked') === 'true';
}

// Mark as unlocked
function setUnlocked() {
    sessionStorage.setItem('birthdayUnlocked', 'true');
}

// Export for use in other files
window.BirthdayUtils = {
    scrollToElement,
    throttle,
    initRevealAnimations,
    autoReveal,
    formatTime,
    shuffleArray,
    isUnlocked,
    setUnlocked
};