/**
 * 🎬 Cinematic Grand Entrance Experience (10-Second 3-Chapter Story)
 * Exactly 10s duration (~3.3s per chapter) + Scroll/Click Dismiss + Finale Salvo
 */
(function () {
    const overlay = document.getElementById('cinematicOverlay');
    const enterBtn = document.getElementById('cinematicEnterBtn');
    const skipBtn = document.getElementById('cinematicSkipBtn');
    const chapterIndicator = document.getElementById('chapterIndicator');
    const slides = document.querySelectorAll('.cinematic-slide');
    const barFills = [
        document.getElementById('barFill1'),
        document.getElementById('barFill2'),
        document.getElementById('barFill3')
    ];
    const barTracks = document.querySelectorAll('.story-bar-track');

    if (!overlay) return;

    // Exactly 10.0 seconds total cinematic experience (3.3s, 3.3s, 3.4s)
    const CHAPTERS = [
        { name: 'CHAPTER I / III · THE DEDICATION', duration: 3300 },
        { name: 'CHAPTER II / III · ROYAL TRIBUTE', duration: 3300 },
        { name: 'CHAPTER III / III · THE UNVEILING', duration: 3400 }
    ];

    let currentChapter = 0;
    let chapterStartTime = Date.now();
    let isDismissed = false;
    let loopRaf = null;

    function dismissCinematic() {
        if (isDismissed) return;
        isDismissed = true;
        cancelAnimationFrame(loopRaf);

        overlay.classList.add('dismissed');

        // Play audio if background music exists
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.play().catch(() => {});
        }
        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) musicToggle.classList.add('playing');

        // Massive grand salvo of firecrackers upon entering
        if (typeof window.launchGrandFireworks === 'function') {
            window.launchGrandFireworks(20);
        }

        setTimeout(() => {
            overlay.remove();
        }, 1200);
    }

    function setChapter(index) {
        if (index >= CHAPTERS.length) {
            dismissCinematic();
            return;
        }

        currentChapter = index;
        chapterStartTime = Date.now();

        // Update slides
        slides.forEach((slide, i) => {
            if (i === currentChapter) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Update chapter label
        if (chapterIndicator) {
            chapterIndicator.textContent = CHAPTERS[currentChapter].name;
        }

        // Update previous bar tracks to completed
        barTracks.forEach((track, i) => {
            if (i < currentChapter) {
                track.classList.add('completed');
                if (barFills[i]) barFills[i].style.width = '100%';
            } else if (i > currentChapter) {
                track.classList.remove('completed');
                if (barFills[i]) barFills[i].style.width = '0%';
            } else {
                track.classList.remove('completed');
            }
        });

        // Trigger celebratory fireworks volley on chapter change
        if (typeof window.launchGrandFireworks === 'function') {
            window.launchGrandFireworks(6);
        }
    }

    function tick() {
        if (isDismissed) return;

        const currentDuration = CHAPTERS[currentChapter].duration;
        const elapsed = Date.now() - chapterStartTime;
        const progress = Math.min(1, elapsed / currentDuration);

        if (barFills[currentChapter]) {
            barFills[currentChapter].style.width = (progress * 100) + '%';
        }

        if (progress >= 1) {
            setChapter(currentChapter + 1);
        }

        loopRaf = requestAnimationFrame(tick);
    }

    // Allow user to click any story bar to jump to that chapter
    barTracks.forEach((track, i) => {
        track.addEventListener('click', (e) => {
            e.stopPropagation();
            setChapter(i);
        });
    });

    if (enterBtn) enterBtn.addEventListener('click', dismissCinematic);
    if (skipBtn) skipBtn.addEventListener('click', dismissCinematic);

    // Auto-dismiss as soon as the user starts scrolling
    window.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > 10) dismissCinematic();
    }, { passive: true });

    window.addEventListener('touchmove', () => {
        dismissCinematic();
    }, { passive: true });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) dismissCinematic();
    }, { passive: true });

    // Grand Finale Salvo when reaching the last section (#closing)
    const closingSection = document.getElementById('closing');
    if (closingSection && 'IntersectionObserver' in window) {
        let hasFiredClosingSalvo = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasFiredClosingSalvo) {
                    hasFiredClosingSalvo = true;
                    if (typeof window.launchGrandFireworks === 'function') {
                        window.launchGrandFireworks(24);
                    }
                }
            });
        }, { threshold: 0.3 });
        observer.observe(closingSection);
    }

    // Start Chapter 1
    setChapter(0);
    loopRaf = requestAnimationFrame(tick);

    console.log('🎬 10-Second Cinematic Story System Initialized');
})();
