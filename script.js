```javascript
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('#game-board');
    const startButton = document.getElementById('start-game');
    const restartButton = document.getElementById('restart-game');

    const difficultySelect = document.getElementById('difficulty');

    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');
    const highScoreDisplay = document.getElementById('high-score');
    const gameMessage = document.getElementById('game-message');

    const allCards = [
        { name: 'card1', img: 'images/distracted.png' },
        { name: 'card1', img: 'images/distracted.png' },

        { name: 'card2', img: 'images/drake.png' },
        { name: 'card2', img: 'images/drake.png' },

        { name: 'card3', img: 'images/fine.png' },
        { name: 'card3', img: 'images/fine.png' },

        { name: 'card4', img: 'images/rollsafe.png' },
        { name: 'card4', img: 'images/rollsafe.png' },

        { name: 'card5', img: 'images/success.png' },
        { name: 'card5', img: 'images/success.png' }
    ];

    let cardArray = [];

    let cardsChosen = [];
    let cardsChosenId = [];
    let cardsWon = [];

    let score = 0;
    let moves = 0;
    let seconds = 0;

    let timerInterval = null;
    let gameStarted = false;
    let checkingMatch = false;

    let highScore = localStorage.getItem('memeGameHighScore') || 0;

    highScoreDisplay.textContent = highScore;


    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {

            const randomIndex = Math.floor(Math.random() * (i + 1));

            [array[i], array[randomIndex]] =
                [array[randomIndex], array[i]];
        }
    }


    function getCardCount() {

        const difficulty = difficultySelect.value;

        if (difficulty === 'easy') {
            return 6;
        }

        if (difficulty === 'hard') {
            return 10;
        }

        return 8;
    }


    function createBoard() {

        clearInterval(timerInterval);

        const cardCount = getCardCount();

        cardArray = allCards.slice(0, cardCount);

        shuffle(cardArray);

        grid.innerHTML = '';

        cardsChosen = [];
        cardsChosenId = [];
        cardsWon = [];

        score = 0;
        moves = 0;
        seconds = 0;

        gameStarted = true;
        checkingMatch = false;

        scoreDisplay.textContent = score;
        movesDisplay.textContent = moves;
        timerDisplay.textContent = '00:00';
        gameMessage.textContent = '';

        for (let i = 0; i < cardArray.length; i++) {

            const card = document.createElement('img');

            card.setAttribute('src', 'images/blank.png');
            card.setAttribute('data-id', i);
            card.setAttribute('alt', 'Memory card');

            card.addEventListener('click', flipCard);

            grid.appendChild(card);
        }

        startTimer();
    }


    function startTimer() {

        timerInterval = setInterval(() => {

            seconds++;

            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            timerDisplay.textContent =
                String(minutes).padStart(2, '0') +
                ':' +
                String(remainingSeconds).padStart(2, '0');

        }, 1000);
    }


    function flipCard() {

        if (!gameStarted || checkingMatch) {
            return;
        }

        const cardId = this.getAttribute('data-id');

        if (cardsChosenId.includes(cardId)) {
            return;
        }

        if (this.style.visibility === 'hidden') {
            return;
        }

        cardsChosen.push(cardArray[cardId].name);
        cardsChosenId.push(cardId);

        this.setAttribute('src', cardArray[cardId].img);

        if (cardsChosen.length === 2) {

            moves++;

            movesDisplay.textContent = moves;

            checkingMatch = true;

            setTimeout(checkForMatch, 600);
        }
    }


    function checkForMatch() {

        const cards = document.querySelectorAll('#game-board img');

        const firstCardId = cardsChosenId[0];
        const secondCardId = cardsChosenId[1];

        if (
            cardsChosen[0] === cardsChosen[1] &&
            firstCardId !== secondCardId
        ) {

            cards[firstCardId].style.visibility = 'hidden';
            cards[secondCardId].style.visibility = 'hidden';

            cards[firstCardId].removeEventListener('click', flipCard);
            cards[secondCardId].removeEventListener('click', flipCard);

            cardsWon.push(cardsChosen[0]);

            score += 100;

            scoreDisplay.textContent = score;

        } else {

            cards[firstCardId].setAttribute(
                'src',
                'images/blank.png'
            );

            cards[secondCardId].setAttribute(
                'src',
                'images/blank.png'
            );

            score = Math.max(0, score - 10);

            scoreDisplay.textContent = score;
        }

        cardsChosen = [];
        cardsChosenId = [];

        checkingMatch = false;

        if (cardsWon.length === cardArray.length / 2) {

            finishGame();
        }
    }


    function finishGame() {

        clearInterval(timerInterval);

        gameStarted = false;

        let timeBonus = Math.max(0, 100 - seconds);

        let finalScore = score + timeBonus;

        score = finalScore;

        scoreDisplay.textContent = score;

        if (score > highScore) {

            highScore = score;

            localStorage.setItem(
                'memeGameHighScore',
                highScore
            );

            highScoreDisplay.textContent = highScore;

            gameMessage.textContent =
                '🎉 Congratulations! New High Score: ' + score;

        } else {

            gameMessage.textContent =
                '🎉 You completed the game! Final Score: ' + score;
        }
    }


    function restartGame() {

        createBoard();
    }


    startButton.addEventListener('click', createBoard);

    restartButton.addEventListener('click', restartGame);

});
```
