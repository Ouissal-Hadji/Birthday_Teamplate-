/**
 * Experience Logic
 */

(function () {
    // ========== CONFIG ==========
    const CONFIG = {
        name: 'Sarah',
        age: 'Twenty-Five',
        date: 'August 25th, 2026',
        sender: 'Your Best Friend'
    };

    // Apply
    document.querySelectorAll('.config-name').forEach(el => el.textContent = CONFIG.name);
    document.querySelectorAll('.config-age').forEach(el => el.textContent = CONFIG.age);
    document.querySelectorAll('.config-date').forEach(el => el.textContent = CONFIG.date);
    document.querySelectorAll('.config-sender').forEach(el => el.textContent = CONFIG.sender);
    document.title = `Happy Birthday, ${CONFIG.name}`;

    // ========== SCROLL SPY ==========
    const sections = document.querySelectorAll('.section');
    const navDots = document.querySelectorAll('.nav-dot');

    function updateNav() {
        const pos = window.scrollY + window.innerHeight / 3;
        sections.forEach((sec, i) => {
            const top = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            if (pos >= top && pos < bottom) {
                navDots.forEach(d => d.classList.remove('active'));
                if (navDots[i]) navDots[i].classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', window.BirthdayUtils ? BirthdayUtils.throttle(updateNav, 100) : updateNav);

    navDots.forEach(dot => {
        dot.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(dot.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const scrollIndicator = document.getElementById('scrollIndicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ========== PARTICLE HELPERS ==========
    function createSparks(x, y, count = 12, colors = ['#f5d061', '#ffd700', '#ffffff', '#e63950']) {
        for (let i = 0; i < count; i++) {
            const spark = document.createElement('div');
            spark.className = 'pop-particle';
            const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
            const distance = 35 + Math.random() * 45;
            const tx = Math.cos(angle) * distance + 'px';
            const ty = Math.sin(angle) * distance + 'px';
            spark.style.setProperty('--tx', tx);
            spark.style.setProperty('--ty', ty);
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            spark.style.background = colors[Math.floor(Math.random() * colors.length)];
            spark.style.width = (3 + Math.random() * 4) + 'px';
            spark.style.height = spark.style.width;
            spark.style.borderRadius = '50%';
            spark.style.boxShadow = `0 0 8px ${spark.style.background}`;
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 700);
        }
    }

    // ========== LUXURY ENVELOPE & LETTER ==========
    const envelopeContainer = document.getElementById('envelopeContainer');
    const envelope3d = document.getElementById('envelope3d');
    const waxSeal = document.getElementById('waxSeal');
    const letterActionBtn = document.getElementById('letterActionBtn');
    const letterBtnLabel = document.getElementById('letterBtnLabel');
    const letterStatusHint = document.getElementById('letterStatusHint');
    const parchmentCloseBtn = document.getElementById('parchmentCloseBtn');
    let isEnvelopeOpen = false;

    function openEnvelope(e) {
        if (isEnvelopeOpen) return;
        isEnvelopeOpen = true;

        // Spawn seal crack sparkles
        if (waxSeal) {
            const rect = waxSeal.getBoundingClientRect();
            createSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 16, ['#ff4d6d', '#ffd700', '#fff', '#e63950']);
        }

        if (envelopeContainer) {
            envelopeContainer.classList.add('open');
            setTimeout(() => {
                envelopeContainer.classList.add('letter-active');
            }, 450);
        }

        if (letterBtnLabel) letterBtnLabel.textContent = 'Fold Letter';
        if (letterStatusHint) letterStatusHint.textContent = 'A special message written just for you';
    }

    function closeEnvelope() {
        if (!isEnvelopeOpen) return;
        isEnvelopeOpen = false;

        if (envelopeContainer) {
            envelopeContainer.classList.remove('letter-active');
            setTimeout(() => {
                envelopeContainer.classList.remove('open');
            }, 300);
        }

        if (letterBtnLabel) letterBtnLabel.textContent = 'Open Letter';
        if (letterStatusHint) letterStatusHint.textContent = 'Tap the wax seal or button to open';
    }

    function toggleEnvelope() {
        if (isEnvelopeOpen) {
            closeEnvelope();
        } else {
            openEnvelope();
        }
    }

    if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
    if (envelope3d) {
        envelope3d.addEventListener('click', (e) => {
            if (!isEnvelopeOpen) openEnvelope(e);
        });
    }
    if (letterActionBtn) letterActionBtn.addEventListener('click', toggleEnvelope);
    if (parchmentCloseBtn) parchmentCloseBtn.addEventListener('click', closeEnvelope);

    // ========== 3D CAKE & REALISTIC CANDLES ==========
    const candles = document.querySelectorAll('.luxury-candle');
    const cakeIllumination = document.getElementById('cakeIllumination');
    const candlesStatusText = document.getElementById('candlesStatusText');
    const blowAllBtn = document.getElementById('blowAllBtn');
    const relightBtn = document.getElementById('relightBtn');
    const cakeCelebration = document.getElementById('cakeCelebration');
    const cakeSubtitle = document.getElementById('cakeSubtitle');
    let blownCount = 0;

    function extinguishCandle(candle) {
        if (candle.classList.contains('blown')) return;
        candle.classList.add('blown');
        blownCount++;

        // Spawn ember sparks
        const rect = candle.getBoundingClientRect();
        createSparks(rect.left + rect.width / 2, rect.top + 10, 10, ['#ff9900', '#ffd700', '#ffffff', '#ff3300']);

        const remaining = candles.length - blownCount;

        if (remaining > 0) {
            const messages = [
                "4 wishes left — dream big! ✨",
                "3 left — think of your fondest memories! 💖",
                "2 left — make your secret wish! 🌟",
                "Last candle! Blow with all your heart! 🎂"
            ];
            if (candlesStatusText) {
                candlesStatusText.textContent = messages[blownCount - 1] || `${remaining} candle${remaining === 1 ? '' : 's'} glowing`;
            }
        } else {
            // ALL CANDLES EXTINGUISHED -> CELEBRATION!
            triggerCakeCelebration();
        }
    }

    function triggerCakeCelebration() {
        if (cakeIllumination) cakeIllumination.classList.add('extinguished');
        if (candlesStatusText) candlesStatusText.textContent = '✨ All wishes made! May they all come true! ✨';
        if (cakeSubtitle) cakeSubtitle.textContent = 'A year filled with joy, magic, and sweet memories';

        if (blowAllBtn) blowAllBtn.hidden = true;
        if (relightBtn) relightBtn.hidden = false;

        if (cakeCelebration) {
            cakeCelebration.hidden = false;
            cakeCelebration.style.display = 'block';
        }

        // Launch celebratory confetti
        launchConfetti();

        // Auto pop decorative balloons sequentially
        document.querySelectorAll('.pballoon:not(.popped)').forEach((b, i) => {
            setTimeout(() => {
                const rect = b.getBoundingClientRect();
                createSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
                b.classList.add('popped');
                setTimeout(() => b.remove(), 300);
            }, 600 + i * 250);
        });
    }

    function relightCandles() {
        blownCount = 0;
        candles.forEach(c => c.classList.remove('blown'));
        if (cakeIllumination) cakeIllumination.classList.remove('extinguished');
        if (candlesStatusText) candlesStatusText.textContent = '5 candles glowing — make a wish!';
        if (cakeSubtitle) cakeSubtitle.textContent = 'Tap each candle to blow it out';
        if (blowAllBtn) blowAllBtn.hidden = false;
        if (relightBtn) relightBtn.hidden = true;
        if (cakeCelebration) {
            cakeCelebration.hidden = true;
            cakeCelebration.style.display = 'none';
        }
    }

    function blowAllCandles() {
        candles.forEach((candle, index) => {
            if (!candle.classList.contains('blown')) {
                setTimeout(() => {
                    extinguishCandle(candle);
                }, index * 140);
            }
        });
    }

    candles.forEach(candle => {
        candle.addEventListener('click', () => extinguishCandle(candle));
    });

    if (blowAllBtn) blowAllBtn.addEventListener('click', blowAllCandles);
    if (relightBtn) relightBtn.addEventListener('click', relightCandles);

    // ========== CONFETTI ENGINE ==========
    function launchConfetti() {
        const confettiContainer = document.getElementById('cakeConfettiWrap') || document.body;
        const colors = ['#d4af37', '#f5d061', '#e8c4c4', '#e74c3c', '#e91e63', '#ffffff', '#ffd700'];

        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.style.position = 'fixed';
            piece.style.top = '-20px';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.width = (6 + Math.random() * 8) + 'px';
            piece.style.height = (10 + Math.random() * 12) + 'px';
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
            piece.style.zIndex = '9999';
            piece.style.pointerEvents = 'none';
            piece.style.opacity = (0.7 + Math.random() * 0.3).toString();

            const duration = 2.5 + Math.random() * 2.5;
            const delay = Math.random() * 0.8;
            const xMovement = (Math.random() - 0.5) * 180;
            const rotation = Math.random() * 720;

            piece.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${xMovement}px, 105vh) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            });

            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), (duration + delay) * 1000 + 200);
        }
    }

    // ========== POPPABLE BALLOONS ==========
    const balloonField = document.getElementById('balloonField');

    function popBalloon(balloon) {
        if (balloon.classList.contains('popped')) return;

        const rect = balloon.getBoundingClientRect();
        let color = '#e74c3c';
        if (balloon.classList.contains('pink')) color = '#e91e63';
        if (balloon.classList.contains('gold')) color = '#d4af37';

        createSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, [color, '#ffffff', '#ffd700']);

        balloon.classList.add('popped');
        setTimeout(() => balloon.remove(), 300);
    }

    document.querySelectorAll('.pballoon').forEach(balloon => {
        balloon.addEventListener('click', () => popBalloon(balloon));
    });
})();
