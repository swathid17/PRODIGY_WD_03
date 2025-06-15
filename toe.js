const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const selectedModeText = document.getElementById('selected-mode');

const urlParams = new URLSearchParams(window.location.search);
let mode = urlParams.get('mode') || 'pvp';

selectedModeText.textContent = 
  mode === 'pvp' ? "Mode: Player vs Player" : "Mode: Player vs AI";

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWin(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s Turn`;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== '' || gameOver) return;

  makeMove(index, currentPlayer);

  if (mode === 'ai' && currentPlayer === 'O' && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('taken');

  if (checkWin(player)) {
    statusText.textContent = `${player} Wins!`;
    gameOver = true;
    return;
  }

  if (checkDraw()) {
    statusText.textContent = "It's a Draw!";
    gameOver = true;
    return;
  }

  switchPlayer();
}

function aiMove() {
  let available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  if (available.length === 0) return;

  let move = available[Math.floor(Math.random() * available.length)];
  makeMove(move, 'O');
}

function resetGame() {
  board.fill('');
  gameOver = false;
  currentPlayer = 'X';
  statusText.textContent = `${currentPlayer}'s Turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });

  if (mode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
