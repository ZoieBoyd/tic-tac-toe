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
    let isPlaying = true;
    let moveCount = 0;
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
        let board = gameboard.getBoard();
        if (board[row][column] === "") {
            board[row][column] = currentPlayer.getPlayerSymbol();
            console.log(board);
            moveCount++;
            if (checkWinner()) {
                console.log(`${currentPlayer.getPlayerName()} has won!`);
                currentPlayer.increaseScore();
                isPlaying = false;
                return;
            } else if (moveCount >= 9) {
                console.log("It's a tie!");
                isPlaying = false;
                return;
            }
            isPlaying && switchPlayerTurn();
        } else {
            console.error("Symbol already present in this cell or does not exist! Try again");
        }
    }

    const getMoveCount = () => moveCount;

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
        let board = gameboard.getBoard();
        return winningConditions.some(condition => 
            condition.every(([row, col]) => board[row][col] === currentPlayer.getPlayerSymbol())
        );
    }

    const newRound = () => {
        gameboard.resetBoard();
        isPlaying = true;
        moveCount = 0;
        currentPlayer = players[0];
    }

    return {getCurrentPlayer, makeMove, getPlayStatus, players, newRound, getMoveCount};
})();

const screenController = (() => {
    const container = document.querySelector(".container");
    const gameboardDiv = document.querySelector(".gameboard");
    const currentPlayerDiv = document.querySelector(".current-player");
    const p1NameText = document.querySelector(".p1-name");
    const p2NameText = document.querySelector(".p2-name");
    const p1ScoreText = document.querySelector(".p1-score");
    const p2ScoreText = document.querySelector(".p2-score");
    const replayBtn = document.querySelector(".replay-btn");
    
    const updatePlayerInfo = () => {
        p1NameText.textContent = `${gameController.players[0].getPlayerName()} Wins:`;
        p2NameText.textContent = `${gameController.players[1].getPlayerName()} Wins:`;
        p1ScoreText.textContent = `${gameController.players[0].getScore()}`;
        p2ScoreText.textContent = `${gameController.players[1].getScore()}`;
    };

    const updateCurrentPlayerText = () => {
        const currentPlayer = gameController.getCurrentPlayer();
        currentPlayerDiv.innerHTML = `Your Turn <span class="${currentPlayer.getPlayerSymbol() === 'X' ? 'player-one' : 'player-two'}">
        ${currentPlayer.getPlayerName()}</span>!`;
    }

    const renderBoard = () => { 
        gameboardDiv.replaceChildren();

        let board = gameboard.getBoard();
        board.forEach((row, rowIndex)=> {
            row.forEach((cell, columnIndex) => {
                const cellBtn = document.createElement("button");
                cellBtn.textContent = cell;
                cellBtn.classList.add("cell-button");
                
                if(cellBtn.textContent === "X") cellBtn.classList.add("x-symbol");
                else if(cellBtn.textContent === "O") cellBtn.classList.add("o-symbol");

                cellBtn.addEventListener("click", () => {
                    if(gameController.getPlayStatus()) {
                        gameController.makeMove(rowIndex, columnIndex);
                        updateScreen();
                    }
                });

                gameboardDiv.appendChild(cellBtn);
            });
        });
    };

    const updateScreen = () => {
        updatePlayerInfo();
        updateCurrentPlayerText();
        renderBoard();
        
        if (!gameController.getPlayStatus()) {
            if (gameController.getMoveCount() === 9){
                currentPlayerDiv.textContent = "It's a tie!";
            } else {
                const currentPlayer = gameController.getCurrentPlayer();
                currentPlayerDiv.innerHTML = `<span class="${currentPlayer.getPlayerSymbol() === 'X' ? 'player-one' : 'player-two'}">${currentPlayer.getPlayerName()}</span> Wins!`; 
            }
            replayBtn.style.visibility = "visible";
            replayBtn.addEventListener("click", () => {
               gameController.newRound();
               updateScreen(); 
               replayBtn.style.visibility = "hidden";
            });
        };
    };
    
    updateScreen();
})();