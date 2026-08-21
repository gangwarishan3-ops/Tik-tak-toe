// Game state
let boxes = document.querySelectorAll('.box');
let resetBtn = document.getElementById('reset-btn');
let gameStatus = document.getElementById('game-status');
let scoreDisplay = document.getElementById('score');

let turnO = true;
let gameActive = true;
let player1 = 'Player 1 (O)';
let player2 = 'Player 2 (X)';
let score = { player1: 0, player2: 0, draws: 0 };

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Load saved score
function loadScore() {
    const saved = localStorage.getItem('tictactoe-score');
    if (saved) {
        score = JSON.parse(saved);
        updateScoreDisplay();
    }
}

// Save score to localStorage
function saveScore() {
    localStorage.setItem('tictactoe-score', JSON.stringify(score));
    updateScoreDisplay();
}

// Update score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `${player1}: ${score.player1} | ${player2}: ${score.player2} | Draws: ${score.draws}`;
}

// Check if there's a winner
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boxes[a].textContent && 
            boxes[a].textContent === boxes[b].textContent && 
            boxes[a].textContent === boxes[c].textContent) {
            return boxes[a].textContent;
        }
    }
    return null;
}

// Check if board is full (draw)
function isBoardFull() {
    return Array.from(boxes).every(box => box.textContent !== '');
}

// Update game status display
function updateStatus() {
    if (gameActive) {
        const currentPlayer = turnO ? player1 : player2;
        gameStatus.textContent = `${currentPlayer}'s Turn`;
    }
}

// End game and update score
function endGame(result) {
    gameActive = false;
    if (result === 'X') {
        gameStatus.textContent = '🎉 ' + player2 + ' Wins!';
        score.player2++;
    } else if (result === 'O') {
        gameStatus.textContent = '🎉 ' + player1 + ' Wins!';
        score.player1++;
    } else {
        gameStatus.textContent = '🤝 Draw!';
        score.draws++;
    }
    saveScore();
}

// Reset game
function resetGame() {
    boxes.forEach(box => {
        box.textContent = '';
        box.classList.remove('player1-move', 'player2-move');
    });
    turnO = true;
    gameActive = true;
    updateStatus();
}

// Event listeners for boxes
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (box.textContent === '' && gameActive) {
            // Make the move
            if (turnO) {
                box.textContent = 'O';
                box.classList.add('player1-move');
            } else {
                box.textContent = 'X';
                box.classList.add('player2-move');
            }
            
            // Check for winner
            const winner = checkWinner();
            if (winner) {
                endGame(winner);
            } else if (isBoardFull()) {
                endGame('draw');
            } else {
                // Switch player
                turnO = !turnO;
                updateStatus();
            }
        }
    });
});

// Reset button
resetBtn.addEventListener('click', resetGame);

// Initialize game
loadScore();
updateStatus();
