/**
 * Gallery Logic — Horizontal scroll carousel, lightbox, navigation
 */

(function () {
    // ========== DOM ELEMENTS ==========
    const track = document.querySelector('.gallery-track');
    const items = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    let currentIndex = 0;
    const itemWidth = 320 + 40; // card width + gap (approximate, recalculated below)
    let calculatedItemWidth = 0;

    // ========== CALCULATE DIMENSIONS ==========
    function calculateDimensions() {
        if (items.length === 0) return;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 40;
        calculatedItemWidth = items[0].offsetWidth + gap;
    }

    // ========== NAVIGATION ==========
    function goToSlide(index) {
        if (!track || items.length === 0) return;

        const maxIndex = Math.max(0, items.length - Math.floor(track.parentElement.offsetWidth / calculatedItemWidth));

        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const offset = currentIndex * calculatedItemWidth;

        track.style.transform = `translateX(-${offset}px)`;

        // Update button visibility
        if (prevBtn) prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        if (nextBtn) nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
    }

    function next() {
        goToSlide(currentIndex + 1);
    }

    function prev() {
        goToSlide(currentIndex - 1);
    }

    // ========== EVENT LISTENERS ==========
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;

    function showLightboxIndex(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        currentLightboxIndex = index;

        const item = items[currentLightboxIndex];
        if (!item) return;

        const img = item.querySelector('img');
        const caption = item.querySelector('.caption-text');
        const date = item.querySelector('.caption-date');

        if (img && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }

        if (lightboxCaption) {
            const dateText = date ? date.textContent : '';
            const capText = caption ? caption.textContent : '';
            lightboxCaption.textContent = dateText ? `${dateText} — ${capText}` : capText;
        }
    }

    // Click on gallery item opens lightbox
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            showLightboxIndex(index);

            if (lightbox) {
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxIndex(currentLightboxIndex - 1);
        });
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showLightboxIndex(currentLightboxIndex + 1);
        });
    }

    // Close lightbox
    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showLightboxIndex(currentLightboxIndex - 1);
            if (e.key === 'ArrowRight') showLightboxIndex(currentLightboxIndex + 1);
        }
    });

    // ========== TOUCH / DRAG SUPPORT ==========
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    if (track) {
        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX;
            scrollLeft = currentIndex * calculatedItemWidth;
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const walk = (startX - x);
            const newOffset = scrollLeft + walk;
            const newIndex = Math.round(newOffset / calculatedItemWidth);
            goToSlide(newIndex);
        });

        track.addEventListener('mouseup', () => {
            isDragging = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseleave', () => {
            isDragging = false;
            track.style.cursor = 'grab';
        });

        // Touch events
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            scrollLeft = currentIndex * calculatedItemWidth;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX;
            const walk = (startX - x);
            const newOffset = scrollLeft + walk;
            const newIndex = Math.round(newOffset / calculatedItemWidth);
            goToSlide(newIndex);
        }, { passive: true });
    }

    // ========== INIT ==========
    window.addEventListener('load', () => {
        calculateDimensions();
        goToSlide(0);
    });

    window.addEventListener('resize', () => {
        calculateDimensions();
        goToSlide(currentIndex);
    });

    console.log('🖼️ Gallery Module Loaded');
})();