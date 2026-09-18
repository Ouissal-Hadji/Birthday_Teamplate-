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
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.55';
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
        ['#ffd700', '#f5d061', '#fff8db', '#e6a122'], // Royal Gold & Amber
        ['#ff758f', '#ff4d6d', '#ffd1dc', '#c9184a'], // Soft Rose
        ['#e0c878', '#c9a84c', '#ffea9f', '#ffb703'], // Champagne
        ['#b388eb', '#8093f1', '#72ddf7', '#ffd166']  // Aurora
    ];

    class FireworkParticle {
        constructor(x, y, color, isShimmer = false) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.isShimmer = isShimmer;
            const angle = Math.random() * Math.PI * 2;
            const speed = isShimmer ? (0.8 + Math.random() * 1.2) : (1.4 + Math.random() * 2.5);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = isShimmer ? (0.8 + Math.random() * 0.8) : (1.2 + Math.random() * 1.2);
            this.alpha = 0.85;
            this.decay = 0.016 + Math.random() * 0.018;
            this.gravity = 0.035;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.98;
            this.alpha -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.alpha);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    class Rocket {
        constructor(targetX, targetY) {
            this.x = targetX !== undefined ? targetX : width * 0.2 + Math.random() * (width * 0.6);
            this.y = height + 10;
            this.targetY = targetY !== undefined ? targetY : height * 0.2 + Math.random() * (height * 0.35);
            this.speed = 6.0 + Math.random() * 2.5;
            this.angle = -Math.PI / 2 + (Math.random() * 0.16 - 0.08);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
            this.color = this.palette[0];
            this.alive = true;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.025;

            // Subtle sparkle trail
            if (Math.random() < 0.2) {
                particles.push(new FireworkParticle(this.x, this.y, '#ffd700', true));
            }

            if (this.y <= this.targetY || this.vy >= 0) {
                this.explode();
                this.alive = false;
            }
        }

        explode() {
            const count = 12 + Math.floor(Math.random() * 6);
            for (let i = 0; i < count; i++) {
                const col = this.palette[Math.floor(Math.random() * this.palette.length)];
                particles.push(new FireworkParticle(this.x, this.y, col));
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 4;
            ctx.shadowColor = '#ffd700';
            ctx.fill();
            ctx.restore();
        }
    }

    // Salvo (Subtle, celebratory occasional volley)
    window.launchGrandFireworks = function (volleyCount = 4) {
        const count = Math.min(volleyCount, 5);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const rx = width * (0.25 + (i / count) * 0.5 + (Math.random() * 0.06 - 0.03));
                const ry = height * (0.2 + Math.random() * 0.25);
                rockets.push(new Rocket(rx, ry));
            }, i * 400);
        }
    };

    let lastRocketTime = Date.now();
    function loop(now) {
        ctx.clearRect(0, 0, width, height);

        // Very rare, gentle ambient rocket (every 16-24s only) so it does not distract from reading
        if (now - lastRocketTime > 18000 + Math.random() * 8000) {
            rockets.push(new Rocket());
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
    console.log('✨ Subtle Fireworks Engine Loaded');
})();
