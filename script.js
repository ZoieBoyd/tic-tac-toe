const gameboard = (() => { // IIFE
    const newBoard = () => new Array(3).fill(null).map(() => new Array(3).fill(""));
    let board = newBoard(); // Creates 3x3 2D Array- easier to reference cells in console for testing
    const resetBoard = () => board = newBoard();
    const getBoard = () => board;
    return {getBoard, resetBoard};
})();

function player(name, symbol) { // Factory Function
    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;
    const getPlayerName = () => name;
    const getPlayerSymbol = () => symbol;
    return {getPlayerName, getPlayerSymbol, getScore, increaseScore};
}

const gameController = (() => {
    const board = gameboard.getBoard();
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
            switchPlayerTurn();
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
                gameboard.resetBoard();
            }
        }
    }        

    return {makeMove}
})();
/*
// This should be the only section that handles DOM elements.
function screenController() {

}

screenController();
*/