/**
 * Countdown Gate — Beautiful timer with early access option
 */

(function () {
    // ========== CONFIG (EDIT PER CLIENT) ==========
    const CONFIG = {
        name: 'Sarah',
        age: '25',
        targetDate: '2026-08-25T00:00:00'
        // Change to a past date like '2020-01-01' to test celebration view
    };

    // ========== DOM ==========
    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        countdownView: document.getElementById('countdownView'),
        celebrationView: document.getElementById('celebrationView'),
        earlyBtn: document.getElementById('earlyBtn')
    };

    // Apply config names
    document.querySelectorAll('.config-name').forEach(el => el.textContent = CONFIG.name);
    document.querySelectorAll('.config-age').forEach(el => el.textContent = CONFIG.age);

    // ========== TIMER ==========
    let timerInterval;

    function updateTimer() {
        const now = new Date().getTime();
        const target = new Date(CONFIG.targetDate).getTime();
        const distance = target - now;

        if (distance <= 0) {
            showCelebration();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (els.days) els.days.textContent = days.toString().padStart(2, '0');
        if (els.hours) els.hours.textContent = hours.toString().padStart(2, '0');
        if (els.minutes) els.minutes.textContent = minutes.toString().padStart(2, '0');
        if (els.seconds) els.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    function showCelebration() {
        if (els.countdownView) els.countdownView.style.display = 'none';
        if (els.celebrationView) {
            els.celebrationView.hidden = false;
            els.celebrationView.style.display = 'block';
        }
        clearInterval(timerInterval);
    }

    // ========== EARLY ACCESS ==========
    if (els.earlyBtn) {
        els.earlyBtn.addEventListener('click', () => {
            window.location.href = 'experience.html';
        });
    }

    // Start
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);

    console.log('⏳ Countdown running for:', CONFIG.targetDate);
})();