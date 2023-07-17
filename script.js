const playerFactory = (marker, name) => {
    return { marker, name };
}

const gameBoard = (() => {
    const board = [[" ", " ", " "],
                   [" ", " ", " "],
                   [" ", " ", " "]];

    const getBoard = () => board;

    const makeMove = (player, row, column) => {
        // Stop execution if cell is already played
        if (board[row][column] !== " ") return;

        // Otherwise play cell
        board[row][column] = player.marker;
    };

    const checkWinner = () => {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== " " && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return board[i][0]; // Return winner symbol
            }

            if (board[0][i] !== " " && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                return board[0][i]; // Return winner symbol
            }
        }

        // Check diagonals
        if (board[0][0] !== " " && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0]; // Return winner symbol
        }

        if (board[0][2] !== " " && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2]; // Return winner symbol
        }

        // Check tie
        let isTie = true;
        outer:
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    isTie = false;
                    break outer;
                }
            }
        }

        if (isTie) {
            return "tie";
        }

        // No winner
        return null;
    };

    return { getBoard, makeMove, checkWinner };
})();

const gameController = (() => {
    const playerOne = playerFactory("X", "Player One");
    const playerTwo = playerFactory("O", "Player Two");
    let currentPlayer = playerOne;

    const _changePlayer = () => {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        }
        else {
            currentPlayer = playerOne;
        }
    };

    const playTurn = () => {
        console.log("Turn of " + currentPlayer.name);

        const board = gameBoard.getBoard();

        for (let i = 0; i < 3; i++)
        {
            console.log("'" + board[i][0] + "'" + board[i][1] + "'" + board[i][2] + "'");
        }

        let row = prompt("Enter row: ");
        let column = prompt("Enter column: ");

        gameBoard.makeMove(currentPlayer, row, column);

        if (gameBoard.checkWinner() !== null) {
            console.log("Winner is " + gameBoard.checkWinner());
            return;
        }

        _changePlayer();

        playTurn();0
    };

    return { playTurn };
})();

// gameController.playTurn();