/**
 * 🎵 Luxury Birthday Audio Experience & Interactive Sound Engine
 * - Smooth YouTube background music stream
 * - Native Web Audio API sound effects (candle blows, match sounds, envelope opens, balloon pops)
 */

(function () {
    const bgPlayerFrame = document.getElementById('bgPlayerFrame');
    const vinylDisc = document.getElementById('vinylDisc');
    const audioToggle = document.getElementById('audioToggle');
    const widgetPlayIcon = document.querySelector('.audio-play');
    const widgetPauseIcon = document.querySelector('.audio-pause');
    const soundWave = document.getElementById('soundWave');

    let isPlaying = false;
    const VIDEO_ID = '0-p5EbAsxUM'; // Romantic Birthday Song

    // ========== NATIVE WEB AUDIO SYNTHESIZER FOR MAGICAL SOUND FX ==========
    let audioCtx = null;
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    window.BirthdayAudioFX = {
        // Soft candle extinguish whoosh & shimmer
        blowCandle() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;

                // Soft breath filter
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.26);

                // High fairy sparkle chime
                const chime = ctx.createOscillator();
                const chimeGain = ctx.createGain();
                chime.type = 'sine';
                chime.frequency.setValueAtTime(880, now + 0.05);
                chime.frequency.exponentialRampToValueAtTime(1320, now + 0.35);

                chimeGain.gain.setValueAtTime(0.08, now + 0.05);
                chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                chime.connect(chimeGain);
                chimeGain.connect(ctx.destination);
                chime.start(now + 0.05);
                chime.stop(now + 0.41);
            } catch (e) {}
        },

        // Grand celebration chime
        celebrationChime() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
                chords.forEach((freq, idx) => {
                    const now = ctx.currentTime + idx * 0.08;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.85);
                });
            } catch (e) {}
        },

        // Card flip tactile click
        cardFlip() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.09);
            } catch (e) {}
        },

        // Match found sparkle
        cardMatch() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const notes = [587.33, 880];
                notes.forEach((freq, i) => {
                    const now = ctx.currentTime + i * 0.1;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);

                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.32);
                });
            } catch (e) {}
        },

        // Wax seal break
        sealBreak() {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(660, now + 0.2);

                gain.gain.setValueAtTime(0.14, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.26);
            } catch (e) {}
        }
    };

    // ========== BACKGROUND MUSIC ENGINE ==========
    function startMusic() {
        getAudioContext();
        if (bgPlayerFrame) {
            bgPlayerFrame.innerHTML = '';
            const iframe = document.createElement('iframe');
            iframe.width = '10';
            iframe.height = '10';
            iframe.src = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=0&loop=1&playlist=${VIDEO_ID}&rel=0&modestbranding=1&playsinline=1`;
            iframe.title = 'Birthday Music';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.style.position = 'absolute';
            iframe.style.opacity = '0';
            iframe.style.pointerEvents = 'none';
            bgPlayerFrame.appendChild(iframe);
        }

        isPlaying = true;
        updateUI();
        console.log('🎵 Music playback started');
    }

    function stopMusic() {
        if (bgPlayerFrame) {
            bgPlayerFrame.innerHTML = '';
        }
        isPlaying = false;
        updateUI();
        console.log('🎵 Music playback paused');
    }

    function toggleMusic() {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function updateUI() {
        if (audioToggle) {
            audioToggle.classList.toggle('playing', isPlaying);
        }
        if (vinylDisc) {
            vinylDisc.style.animationPlayState = isPlaying ? 'running' : 'paused';
        }
        if (widgetPlayIcon) widgetPlayIcon.hidden = isPlaying;
        if (widgetPauseIcon) widgetPauseIcon.hidden = !isPlaying;
        if (soundWave) {
            soundWave.classList.toggle('active', isPlaying);
        }
    }

    // Export global functions
    window.startBirthdayMusic = startMusic;
    window.stopBirthdayMusic = stopMusic;
    window.toggleBirthdayMusic = toggleMusic;

    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    console.log('🎵 Luxury Birthday Audio Engine Ready');
})();