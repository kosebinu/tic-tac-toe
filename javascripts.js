// Use a module pattern (IIFE) to create a sigle Gameboard object
const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (!board[index]) board[index] = marker;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

// const player1 = Player('Alice', 'X');
// const player2 = Player('Bob', 'O');
// console.log(player1, player2);

// We use a module pattern for a GameController object

const GameController = (() => {
    let players = [];
    let currentPlayer;
    let gameOver = false;

    const init = (player1Name, player2Name) => {
        players = [
            Player(player1Name || 'Player 1', 'X'),
            Player(player2Name || 'Player 2', 'O')
        ];
        currentPlayer = players[0];
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
        document.getElementById('restart-game').style.display = 'none';
    };

    const playTurn = (index) => {
        if (gameOver || Gameboard.getBoard()[index]) return;

        Gameboard.updateBoard(index, currentPlayer.marker);

        if (checkWinner()) {
            gameOver = true;
            DisplayController.updateStatus(`${currentPlayer.name} wins!`);
            document.getElementById('restart-game').style.display = 'block';
            return;
        }

        if (isTie()) {
            gameOver = true;
            DisplayController.updateStatus(`It's a tie!`);
            document.getElementById('restart-game').style.display = 'block';
            return;
        }

        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        DisplayController.updateStatus(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
    };

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];
        return winPatterns.some(pattern =>
            pattern.every(index => Gameboard.getBoard()[index] === currentPlayer.marker)
        );
    };

    const isTie = () => Gameboard.getBoard().every(cell => cell);

    return { init, playTurn };
})();

const DisplayController = (() => {
    const renderBoard = () => {
        const board = Gameboard.getBoard();
        const boardContainer = document.getElementById('board');
        boardContainer.innerHTML = '';
        board.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => {
                GameController.playTurn(index);
                renderBoard();
            });
            boardContainer.appendChild(cellElement);
        });
    };

    const updateStatus = (message) => {
        const status = document.getElementById('game-status');
        status.textContent = message;
    };

    return { renderBoard, updateStatus };
})();

// Event Listeners
document.getElementById('start-game').addEventListener('click', () => {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    GameController.init(player1Name, player2Name);
});

document.getElementById('restart-game').addEventListener('click', () => {
    GameController.init(document.getElementById('player1').value, document.getElementById('player2').value);
});
