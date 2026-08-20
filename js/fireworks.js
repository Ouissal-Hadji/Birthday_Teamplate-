/**
 * Vibrant Celebration Fireworks & Firecrackers Engine (المفرقعات والاحتفالات)
 * Continuous vibrant firecracker rockets + golden spark trails + multi-color bursts
 */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'celebrationFireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.mixBlendMode = 'screen';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const rockets = [];

    const PALETTES = [
        ['#ffd700', '#f5d061', '#fff8db', '#e6a122', '#ffffff', '#ffbe0b'], // Royal Gold & Amber
        ['#ff758f', '#ff4d6d', '#ffd1dc', '#c9184a', '#ffffff', '#ff0054'], // Rose & Ruby Fire
        ['#e0c878', '#c9a84c', '#ffea9f', '#ffb703', '#ffffff', '#fb5607'], // Champagne & Sunset
        ['#b388eb', '#8093f1', '#72ddf7', '#ffd166', '#ffffff', '#06d6a0'], // Magical Aurora
        ['#ffffff', '#fff3b0', '#e09f3e', '#ff5400', '#ffd60a']              // Celebration Mix
    ];

    class FireworkParticle {
        constructor(x, y, color, isShimmer = false) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.isShimmer = isShimmer;
            const angle = Math.random() * Math.PI * 2;
            const speed = isShimmer ? (1 + Math.random() * 2) : (2.2 + Math.random() * 4.5);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = isShimmer ? (1 + Math.random() * 1.5) : (1.8 + Math.random() * 2.2);
            this.alpha = 1;
            this.decay = 0.012 + Math.random() * 0.016;
            this.gravity = 0.055;
            this.flicker = Math.random() * 0.35;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.975;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            const currentAlpha = Math.max(0, this.alpha - (Math.random() < 0.2 ? this.flicker : 0));
            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    class Rocket {
        constructor(targetX, targetY) {
            this.x = targetX !== undefined ? targetX + (Math.random() * 50 - 25) : width * 0.1 + Math.random() * (width * 0.8);
            this.y = height + 10;
            this.targetY = targetY !== undefined ? targetY : height * 0.12 + Math.random() * (height * 0.45);
            this.speed = 7.5 + Math.random() * 4;
            this.angle = -Math.PI / 2 + (Math.random() * 0.28 - 0.14);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
            this.color = this.palette[0];
            this.alive = true;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.035;

            // Sparkle rocket trail
            if (Math.random() < 0.7) {
                particles.push(new FireworkParticle(this.x, this.y, '#ffd700', true));
            }

            if (this.y <= this.targetY || this.vy >= 0) {
                this.explode();
                this.alive = false;
            }
        }

        explode() {
            const count = 36 + Math.floor(Math.random() * 24);
            for (let i = 0; i < count; i++) {
                const col = this.palette[Math.floor(Math.random() * this.palette.length)];
                particles.push(new FireworkParticle(this.x, this.y, col));
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffd700';
            ctx.fill();
            ctx.restore();
        }
    }

    // Touch / click burst
    window.addEventListener('pointerdown', (e) => {
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        const count = 35 + Math.floor(Math.random() * 20);
        for (let i = 0; i < count; i++) {
            const col = palette[Math.floor(Math.random() * palette.length)];
            particles.push(new FireworkParticle(e.clientX, e.clientY, col));
        }
    });

    // Salvo
    window.launchGrandFireworks = function (volleyCount = 14) {
        for (let i = 0; i < volleyCount; i++) {
            setTimeout(() => {
                const rx = width * (0.15 + (i / volleyCount) * 0.7 + (Math.random() * 0.08 - 0.04));
                const ry = height * (0.15 + Math.random() * 0.35);
                rockets.push(new Rocket(rx, ry));
            }, i * 180);
        }
    };

    let lastRocketTime = 0;
    function loop(now) {
        ctx.clearRect(0, 0, width, height);

        // Frequent lively bursts
        if (now - lastRocketTime > 700 + Math.random() * 600) {
            rockets.push(new Rocket());
            if (Math.random() < 0.45) {
                setTimeout(() => rockets.push(new Rocket()), 180);
            }
            lastRocketTime = now;
        }

        // Update & draw rockets
        for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i];
            r.update();
            if (!r.alive) {
                rockets.splice(i, 1);
            } else {
                r.draw();
            }
        }

        // Update & draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            if (p.alpha <= 0) {
                particles.splice(i, 1);
            } else {
                p.draw();
            }
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    console.log('🎆 Vibrant Fireworks Engine Loaded');
})();
