/**
 * 🌸 Delicate Falling Flower Petals Engine
 * Soft, graceful, light rose petals & cherry blossoms
 */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'fallingPetalsCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9998';
    canvas.style.opacity = '0.8';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const PETAL_TYPES = [
        { color1: '#ff4d6d', color2: '#c9184a', shadow: '#590d22' }, // Velvet Rose
        { color1: '#ff85a1', color2: '#ff4d6d', shadow: '#a4133c' }, // Blossom Pink
        { color1: '#ffd700', color2: '#c9a84c', shadow: '#7a5c18' }, // Golden Peony
        { color1: '#ffb3c6', color2: '#ff758f', shadow: '#800f2f' }  // Soft Sakura
    ];

    class Petal {
        constructor(isInitial = false) {
            this.reset(isInitial);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? Math.random() * height : -25;
            this.size = 10 + Math.random() * 14;
            this.type = PETAL_TYPES[Math.floor(Math.random() * PETAL_TYPES.length)];
            this.speedY = 1.0 + Math.random() * 1.8;
            this.speedX = (Math.random() - 0.5) * 1.2;
            this.rotSpeed = (Math.random() - 0.5) * 0.03;
            this.rotation = Math.random() * Math.PI * 2;
            this.flipSpeed = 0.02 + Math.random() * 0.03;
            this.flip = Math.random() * Math.PI;
            this.swaySpeed = 0.015 + Math.random() * 0.02;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swayDistance = 20 + Math.random() * 30;
            this.baseX = this.x;
            this.opacity = 0.65 + Math.random() * 0.25;
        }

        update() {
            this.y += this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x = this.baseX + Math.sin(this.swayAngle) * this.swayDistance;
            this.rotation += this.rotSpeed;
            this.flip += this.flipSpeed;

            if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(Math.cos(this.flip), 1);

            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size / 1.5, this.size / 3, 0, this.size);
            ctx.bezierCurveTo(-this.size / 1.5, this.size / 3, -this.size / 2, -this.size / 2, 0, -this.size / 2);

            const gradient = ctx.createLinearGradient(0, -this.size / 2, 0, this.size);
            gradient.addColorStop(0, this.type.color1);
            gradient.addColorStop(1, this.type.color2);

            ctx.fillStyle = gradient;
            ctx.globalAlpha = this.opacity;
            ctx.shadowColor = this.type.shadow;
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.restore();
        }
    }

    const petals = [];
    const PETAL_COUNT = 22; // Lighter, delicate count
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal(true));
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < petals.length; i++) {
            petals[i].update();
            petals[i].draw();
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    console.log('🌸 Light Falling Petals Engine Loaded');
})();
