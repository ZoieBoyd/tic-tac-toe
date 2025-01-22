const gameboard = (() => {
    const newBoard = () => new Array(3).fill(null).map(() => new Array(3).fill("")); // Creates a 3x3 empty game board
    let board = newBoard();
    const resetBoard = () => board = newBoard();
    const getBoard = () => board;
    return {getBoard, resetBoard};
})();

function player(name, symbol) {
    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;
    const getPlayerName = () => name;
    const getPlayerSymbol = () => symbol;
    return {getPlayerName, getPlayerSymbol, getScore, increaseScore};
}

const gameController = (() => {
    const board = gameboard.getBoard();
    let isPlaying = true;
    const getPlayStatus = () => isPlaying;
    const players = [
        player("Player One", "X"),
        player("Player Two", "O")
    ];

    let currentPlayer = players[0];
    const switchPlayerTurn = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
    const getCurrentPlayer = () => currentPlayer;

    const makeMove = (row, column) => { 
        if (board[row][column] === "") {
            board[row][column] = currentPlayer.getPlayerSymbol();
            console.log(board);
            checkWinner();
            isPlaying && switchPlayerTurn();
        } else {
            console.error("Symbol already present in this cell or does not exist! Try again");
        }
    }

    const winningConditions = [
        // Columns
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        // Rows
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        // Diagonals
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ];

    const checkWinner = () => {
        const coordinates = [];
        for(let row = 0; row < board.length; row++) {
            for(let column = 0; column < board[row].length; column++) {
                if(currentPlayer.getPlayerSymbol() === board[row][column]) {
                    coordinates.push([row, column]);
                }
            }
        }
        for (const condition of winningConditions) {
            if (
                condition.every(conditionCoords => 
                    coordinates.some(playerCoords =>
                        playerCoords[0] === conditionCoords[0] &&
                        playerCoords[1] === conditionCoords[1]
                    )
                )
            ) {
                console.log(`${currentPlayer.getPlayerName()} has won!`);
                currentPlayer.increaseScore();
                console.log(`Current Scores:\n${players[0].getPlayerName()}: ${players[0].getScore()}\t${players[1].getPlayerName()}: ${players[1].getScore()}`)
                isPlaying = false;
                //gameboard.resetBoard();
            }
        }
    }
    
    return {getCurrentPlayer, makeMove, getPlayStatus, players};
})();

const screenController = (() => {
    const gameboardDiv = document.querySelector(".gameboard");
    const currentPlayerDiv = document.querySelector(".current-player");
    const playerOneScore = document.querySelector(".player-one-score")
    const playerTwoScore = document.querySelector(".player-two-score");
    playerOneScore.textContent = `${gameController.players[0].getPlayerName()} Wins:`;
    playerTwoScore.textContent = `${gameController.players[1].getPlayerName()} Wins:`;
    const updateScreen = () => {
        const currentPlayer = gameController.getCurrentPlayer();
        gameboardDiv.replaceChildren();
        const board = gameboard.getBoard();
        currentPlayerDiv.textContent = `Your Turn ${currentPlayer.getPlayerName()}!`;
        board.forEach((row, rowIndex)=> {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement("button");
                cellBtn.textContent = cell;
                cellBtn.classList.add("cell-button");
                if(cellBtn.textContent === "X") {
                    cellBtn.classList.add("x-symbol");
                } else if(cellBtn.textContent === "O") {
                    cellBtn.classList.add("o-symbol");
                }
                cellBtn.addEventListener("click", () => {
                    gameController.makeMove(rowIndex, columnIndex);
                    gameController.getPlayStatus();
                    updateScreen();
                });
                if (!gameController.getPlayStatus()) {
                    cellBtn.disabled = true;
                    currentPlayerDiv.textContent = `${currentPlayer.getPlayerName()} Wins!`; 
                }
                gameboardDiv.appendChild(cellBtn);
            });
        });
    }
    updateScreen();
})();