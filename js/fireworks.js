/**
 * Full-Website Celebration Fireworks & High-Intensity Firecrackers (المفرقعات)
 * Continuous ambient fireworks + Grand Entrance Salvo + Rocket Trails + Touch Bursts
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
        ['#ffffff', '#fff3b0', '#e09f3e', '#9e2a2b', '#ff5400', '#ffd60a']  // Grand Celebration Salvo
    ];

    class FireworkParticle {
        constructor(x, y, color, isShimmer = false, isHeavy = false) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.isShimmer = isShimmer;
            const angle = Math.random() * Math.PI * 2;
            const speed = isShimmer 
                ? (1 + Math.random() * 2.5) 
                : (isHeavy ? 3 + Math.random() * 6.5 : 2 + Math.random() * 4.8);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = isShimmer ? (1 + Math.random() * 1.5) : (2 + Math.random() * 2.5);
            this.alpha = 1;
            this.decay = 0.01 + Math.random() * 0.015;
            this.gravity = 0.06;
            this.flicker = Math.random() * 0.4;
            this.trail = [];
            this.maxTrail = isShimmer ? 0 : 3;
        }

        update() {
            if (this.maxTrail > 0) {
                this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
                if (this.trail.length > this.maxTrail) this.trail.shift();
            }

            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.97;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            const currentAlpha = Math.max(0, this.alpha - (Math.random() < 0.2 ? this.flicker : 0));
            
            // Draw spark trail
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                ctx.beginPath();
                ctx.arc(t.x, t.y, this.radius * (i / this.trail.length) * 0.8, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = t.alpha * 0.4;
                ctx.fill();
            }

            ctx.globalAlpha = currentAlpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    class Rocket {
        constructor(targetX, targetY) {
            this.x = targetX !== undefined ? targetX + (Math.random() * 60 - 30) : width * 0.1 + Math.random() * (width * 0.8);
            this.y = height + 10;
            this.targetY = targetY !== undefined ? targetY : height * 0.1 + Math.random() * (height * 0.45);
            this.speed = 8 + Math.random() * 5;
            this.angle = -Math.PI / 2 + (Math.random() * 0.3 - 0.15);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
            this.color = this.palette[0];
            this.alive = true;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04;

            // Shimmering rocket trail
            if (Math.random() < 0.8) {
                particles.push(new FireworkParticle(this.x, this.y, '#ffd700', true));
            }

            if (this.y <= this.targetY || this.vy >= 0) {
                this.explode();
                this.alive = false;
            }
        }

        explode() {
            const count = 45 + Math.floor(Math.random() * 35);
            for (let i = 0; i < count; i++) {
                const col = this.palette[Math.floor(Math.random() * this.palette.length)];
                particles.push(new FireworkParticle(this.x, this.y, col, false, true));
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 14;
            ctx.shadowColor = '#ffd700';
            ctx.fill();
            ctx.restore();
        }
    }

    // Interactive burst on tap / click
    window.addEventListener('pointerdown', (e) => {
        const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
        const count = 40 + Math.floor(Math.random() * 25);
        for (let i = 0; i < count; i++) {
            const col = palette[Math.floor(Math.random() * palette.length)];
            particles.push(new FireworkParticle(e.clientX, e.clientY, col, false, true));
        }
    });

    // Grand Entrance Salvo (Intense volley of fireworks)
    window.launchGrandFireworks = function (volleyCount = 14) {
        for (let i = 0; i < volleyCount; i++) {
            setTimeout(() => {
                const rx = width * (0.15 + (i / volleyCount) * 0.7 + (Math.random() * 0.1 - 0.05));
                const ry = height * (0.15 + Math.random() * 0.35);
                rockets.push(new Rocket(rx, ry));
            }, i * 180);
        }
    };

    // Auto-launch intense salvo upon opening
    setTimeout(() => {
        window.launchGrandFireworks(12);
    }, 400);

    let lastRocketTime = 0;
    function loop(now) {
        ctx.clearRect(0, 0, width, height);

        // Frequent ambient celebration launches
        if (now - lastRocketTime > 600 + Math.random() * 700) {
            rockets.push(new Rocket());
            if (Math.random() < 0.4) {
                setTimeout(() => rockets.push(new Rocket()), 150);
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
    console.log('🎆 Grand Celebration Fireworks Engine Loaded');
})();
