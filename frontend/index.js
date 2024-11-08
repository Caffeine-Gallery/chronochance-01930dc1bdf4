import { backend } from "declarations/backend";

let gameActive = false;

const startButton = document.getElementById('startButton');
const reactionButton = document.getElementById('reactionButton');
const gameCircle = document.getElementById('gameCircle');
const gameStatus = document.getElementById('gameStatus');
const message = document.getElementById('message');
const currentScoreElement = document.getElementById('currentScore');
const highScoreElement = document.getElementById('highScore');
const difficultySelect = document.getElementById('difficulty');

async function updateGameState() {
    const state = await backend.getGameState();
    currentScoreElement.textContent = state.currentScore.toString();
    highScoreElement.textContent = state.highScore.toString();
    gameActive = state.isActive;
}

async function startGame() {
    startButton.disabled = true;
    reactionButton.disabled = false;
    gameCircle.classList.remove('active', 'failed');
    gameStatus.textContent = 'Get ready...';
    message.textContent = '';

    try {
        const difficulty = parseInt(difficultySelect.value);
        const response = await backend.startGame(difficulty);
        message.textContent = response;
        gameCircle.classList.add('active');
        gameStatus.textContent = 'Click Now!';
        await updateGameState();
    } catch (error) {
        message.textContent = 'Error starting game: ' + error.message;
        startButton.disabled = false;
    }
}

async function handleReaction() {
    if (!gameActive) {
        gameCircle.classList.add('failed');
        gameStatus.textContent = 'Too late!';
        return;
    }

    try {
        const response = await backend.playerReaction();
        message.textContent = response;
        gameCircle.classList.remove('active');
        gameCircle.classList.add('success');
        gameStatus.textContent = 'Great job!';
        await updateGameState();
        
        startButton.disabled = false;
        reactionButton.disabled = true;
    } catch (error) {
        message.textContent = 'Error: ' + error.message;
    }
}

startButton.addEventListener('click', startGame);
reactionButton.addEventListener('click', handleReaction);

// Initial state update
updateGameState();
