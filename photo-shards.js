/**
 * 🌟 Multi-Shape Photo Confetti & Memory Shards Engine
 * Clean background scattered shapes (Stars, Hearts, Diamonds, Hexagons, Polaroids)
 * Falling dynamically & fast in the background behind page content
 */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'bgPhotoShardsCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0'; // Strictly in background behind items
    canvas.style.opacity = '0.9';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const PHOTO_SRCS = [
        'assets/images/photos/hero.jpg',
        'assets/images/photos/story-1.jpg',
        'assets/images/photos/story-2.jpg',
        'assets/images/photos/story-3.jpg',
        'assets/images/photos/story-4.jpg',
        'assets/images/photos/story-5.jpg',
        'assets/images/photos/story-6.jpg'
    ];

    const loadedImages = [];
    PHOTO_SRCS.forEach((src) => {
        const img = new Image();
        img.src = src;
        img.onload = () => loadedImages.push(img);
    });

    // Helper functions for custom shapes
    function drawStarPath(ctx, r) {
        ctx.beginPath();
        const points = 5;
        const inset = 0.48;
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? r : r * inset;
            const angle = (i * Math.PI) / points - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function drawHeartPath(ctx, size) {
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, size * 0.2);
        // top left curve
        ctx.bezierCurveTo(
            -size / 2, -size / 2,
            -size, topCurveHeight / 2,
            0, size
        );
        // top right curve
        ctx.bezierCurveTo(
            size, topCurveHeight / 2,
            size / 2, -size / 2,
            0, size * 0.2
        );
        ctx.closePath();
    }

    function drawHexagonPath(ctx, r) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }

    function drawDiamondPath(ctx, w, h) {
        ctx.beginPath();
        ctx.moveTo(0, -h / 2);
        ctx.lineTo(w / 2, 0);
        ctx.lineTo(0, h / 2);
        ctx.lineTo(-w / 2, 0);
        ctx.closePath();
    }

    const SHAPES = ['star', 'heart', 'diamond', 'hexagon', 'circle', 'square'];

    class PhotoShards {
        constructor(isInitial = false) {
            this.reset(isInitial);
        }

        reset(isInitial = false) {
            this.x = Math.random() * width;
            this.y = isInitial ? Math.random() * height : -80;
            this.size = 38 + Math.random() * 26; // Clean visible piece
            this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            this.speedY = 2.4 + Math.random() * 2.8; // Faster, energetic fall
            this.speedX = (Math.random() - 0.5) * 2.0;
            this.rotSpeed = (Math.random() - 0.5) * 0.05;
            this.rotation = Math.random() * Math.PI * 2;
            this.flipSpeed = 0.03 + Math.random() * 0.04;
            this.flip = Math.random() * Math.PI;
            this.swaySpeed = 0.02 + Math.random() * 0.03;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swayDistance = 35 + Math.random() * 45; // Widely scattered
            this.baseX = this.x;
            this.opacity = 0.7 + Math.random() * 0.28;
            this.imageIndex = Math.floor(Math.random() * PHOTO_SRCS.length);
        }

        update() {
            this.y += this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x = this.baseX + Math.sin(this.swayAngle) * this.swayDistance;
            this.rotation += this.rotSpeed;
            this.flip += this.flipSpeed;

            if (this.y > height + 80 || this.x < -80 || this.x > width + 80) {
                this.reset(false);
            }
        }

        draw() {
            const img = loadedImages[this.imageIndex % loadedImages.length];
            if (!img || !img.complete) return;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.scale(Math.cos(this.flip), 1); // 3D flip

            const s = this.size;

            ctx.globalAlpha = this.opacity;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;

            // Draw and clip based on shape
            ctx.save();
            if (this.shape === 'star') {
                drawStarPath(ctx, s * 0.65);
            } else if (this.shape === 'heart') {
                drawHeartPath(ctx, s * 0.55);
            } else if (this.shape === 'diamond') {
                drawDiamondPath(ctx, s * 0.9, s * 1.2);
            } else if (this.shape === 'hexagon') {
                drawHexagonPath(ctx, s * 0.55);
            } else if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
                ctx.closePath();
            } else {
                // Rounded square / polaroid
                ctx.beginPath();
                ctx.roundRect(-s / 2, -s / 2, s, s, 6);
                ctx.closePath();
            }

            // Fill background white
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Clip photo inside shape
            ctx.clip();
            ctx.drawImage(img, -s / 2, -s / 2, s, s);
            ctx.restore();

            // Draw glowing gold border around shape
            ctx.save();
            if (this.shape === 'star') {
                drawStarPath(ctx, s * 0.65);
            } else if (this.shape === 'heart') {
                drawHeartPath(ctx, s * 0.55);
            } else if (this.shape === 'diamond') {
                drawDiamondPath(ctx, s * 0.9, s * 1.2);
            } else if (this.shape === 'hexagon') {
                drawHexagonPath(ctx, s * 0.55);
            } else if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
                ctx.closePath();
            } else {
                ctx.beginPath();
                ctx.roundRect(-s / 2, -s / 2, s, s, 6);
                ctx.closePath();
            }
            ctx.strokeStyle = 'rgba(245, 208, 97, 0.75)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            ctx.restore();
        }
    }

    const pieces = [];
    const PIECE_COUNT = 24; // Scattered count
    for (let i = 0; i < PIECE_COUNT; i++) {
        pieces.push(new PhotoShards(true));
    }

    function loop() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < pieces.length; i++) {
            pieces[i].update();
            pieces[i].draw();
        }

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    console.log('⭐ Multi-Shape Photo Shards Engine Loaded');
})();
