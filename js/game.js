/**
 * Game Logic — 6-pair memory match card game
 */

(function () {
    // ========== DOM ELEMENTS ==========
    const gameBoard = document.getElementById('gameBoard');
    const gameGrid = document.getElementById('gameGrid');
    const gameStartBtn = document.getElementById('gameStartBtn');
    const gameScore = document.getElementById('gameScore');
    const gameTime = document.getElementById('gameTime');
    const gameMessage = document.getElementById('gameMessage');
    const gameReward = document.getElementById('gameReward');
    const rewardBtn = document.getElementById('rewardBtn');

    // ========== GAME CONFIG ==========
    const EMOJIS = ['🎂', '🎁', '🎈', '🎉', '💖', '🌟'];
    const TOTAL_PAIRS = 6;

    // ========== GAME STATE ==========
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let isLocked = false;
    let gameActive = false;
    let timerInterval = null;
    let secondsElapsed = 0;

    // ========== INITIALIZATION ==========
    function initGame() {
        if (!gameGrid) return;

        // Clear grid
        gameGrid.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        isLocked = false;
        gameActive = true;
        secondsElapsed = 0;

        // Update UI
        updateScore();
        updateTime();
        gameMessage.innerHTML = '<p>Find all the matching pairs to reveal a secret message!</p>';
        gameStartBtn.textContent = 'Restart Game';
        if (gameReward) gameReward.style.display = 'none';
        gameBoard.style.display = 'block';

        // Create pairs and shuffle
        const pairs = [...EMOJIS, ...EMOJIS];
        const shuffled = window.BirthdayUtils
            ? window.BirthdayUtils.shuffleArray(pairs)
            : pairs.sort(() => Math.random() - 0.5);

        // Create card elements
        shuffled.forEach((emoji, index) => {
            const card = createCard(emoji, index);
            cards.push({ element: card, emoji: emoji, index: index, matched: false });
            gameGrid.appendChild(card);
        });

        // Start timer
        startTimer();
    }

    function createCard(emoji, index) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;

        card.innerHTML = `
            <div class="game-card-front">
                <span>✦</span>
            </div>
            <div class="game-card-back">
                <span>${emoji}</span>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(index));

        return card;
    }

    // ========== GAMEPLAY ==========
    function handleCardClick(index) {
        if (!gameActive || isLocked) return;

        const card = cards[index];
        if (card.matched || flippedCards.includes(index)) return;

        // Flip the card
        flipCard(index);

        // Check for match
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }

    function flipCard(index) {
        const card = cards[index];
        card.element.classList.add('flipped');
        flippedCards.push(index);
    }

    function unflipCard(index) {
        const card = cards[index];
        card.element.classList.remove('flipped');
    }

    function checkMatch() {
        isLocked = true;
        const [first, second] = flippedCards;
        const card1 = cards[first];
        const card2 = cards[second];

        if (card1.emoji === card2.emoji) {
            // Match found!
            setTimeout(() => {
                card1.element.classList.add('matched');
                card2.element.classList.add('matched');
                card1.matched = true;
                card2.matched = true;
                matchedPairs++;
                flippedCards = [];
                isLocked = false;
                updateScore();

                if (matchedPairs === TOTAL_PAIRS) {
                    endGame();
                }
            }, 600);
        } else {
            // No match
            setTimeout(() => {
                unflipCard(first);
                unflipCard(second);
                flippedCards = [];
                isLocked = false;
            }, 1000);
        }
    }

    // ========== UI UPDATES ==========
    function updateScore() {
        if (gameScore) {
            gameScore.textContent = `${matchedPairs} / ${TOTAL_PAIRS}`;
        }
    }

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            updateTime();
        }, 1000);
    }

    function updateTime() {
        if (gameTime) {
            const formatted = window.BirthdayUtils
                ? window.BirthdayUtils.formatTime(secondsElapsed)
                : `${Math.floor(secondsElapsed / 60).toString().padStart(2, '0')}:${(secondsElapsed % 60).toString().padStart(2, '0')}`;
            gameTime.textContent = formatted;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // ========== END GAME ==========
    function endGame() {
        gameActive = false;
        stopTimer();

        // Show celebration message
        if (gameMessage) {
            gameMessage.innerHTML = '<p style="color: var(--gold-light); font-weight: 600;">👑 Brilliant! Memory Puzzle Solved!</p>';
        }

        // Show reward after brief delay
        setTimeout(() => {
            if (gameBoard) gameBoard.style.display = 'none';
            if (gameReward) {
                gameReward.style.display = 'block';
                gameReward.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Burst celebration particles
                const rect = gameReward.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + 120;
                for (let i = 0; i < 30; i++) {
                    const spark = document.createElement('div');
                    spark.className = 'pop-particle';
                    const angle = (Math.PI * 2 * i) / 30;
                    const distance = 40 + Math.random() * 60;
                    spark.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
                    spark.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
                    spark.style.left = centerX + 'px';
                    spark.style.top = centerY + 'px';
                    spark.style.background = ['#ffd700', '#f5d061', '#ff758f', '#ffffff'][i % 4];
                    spark.style.width = '6px';
                    spark.style.height = '6px';
                    spark.style.borderRadius = '50%';
                    document.body.appendChild(spark);
                    setTimeout(() => spark.remove(), 750);
                }
            }
        }, 500);
    }

    // ========== EVENT LISTENERS ==========
    if (gameStartBtn) {
        gameStartBtn.addEventListener('click', initGame);
    }

    const wishesPrizeList = document.getElementById('wishesPrizeList');
    const wishesPrevBtn = document.getElementById('wishesPrevBtn');
    const wishesNextBtn = document.getElementById('wishesNextBtn');

    if (wishesNextBtn && wishesPrizeList) {
        wishesNextBtn.addEventListener('click', () => {
            wishesPrizeList.scrollBy({ left: 230, behavior: 'smooth' });
        });
    }

    if (wishesPrevBtn && wishesPrizeList) {
        wishesPrevBtn.addEventListener('click', () => {
            wishesPrizeList.scrollBy({ left: -230, behavior: 'smooth' });
        });
    }

    if (rewardBtn) {
        rewardBtn.addEventListener('click', () => {
            // Scroll to birthday cake section
            document.getElementById('cake')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    console.log('🎮 Game Module Loaded');
})();