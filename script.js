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

    const undoMove = (row, column) => {
        board[row][column] = " ";
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

    return { getBoard, makeMove, checkWinner, undoMove };
})();

const consoleGameController = (() => {
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

        playTurn();
    };

    return { playTurn };
})();

const displayController = (() => {
    const textContainer = document.getElementById('messageContainer');

    const drawBoard = (board) => {
        const container = document.getElementById("cellContainer");

        container.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Create a "cell" element
                let cell = document.createElement("div");
                cell.classList.add("cell");
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-column', j);

                if (board[i][j] === "X") {
                    // Create an SVG element for an X
                    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svgElement.setAttribute("fill", "none");
                    svgElement.setAttribute("viewBox", "0 0 24 24");
                    svgElement.setAttribute("stroke-width", "1.5");
                    svgElement.setAttribute("stroke", "currentColor");
                    svgElement.classList.add("w-6", "h-6");

                    // Create the path element and set its attributes
                    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    pathElement.setAttribute("stroke-linecap", "round");
                    pathElement.setAttribute("stroke-linejoin", "round");
                    pathElement.setAttribute("d", "M6 18L18 6M6 6l12 12");

                    // Append the path element to the SVG element
                    svgElement.appendChild(pathElement);

                    cell.appendChild(svgElement);
                }
                else if (board[i][j] === "O") {
                    // Create an SVG element
                    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svgElement.setAttribute("fill", "none");
                    svgElement.setAttribute("viewBox", "0 0 24 24");
                    svgElement.setAttribute("stroke-width", "1.5");
                    svgElement.setAttribute("stroke", "currentColor");
                    svgElement.classList.add("w-6", "h-6");

                    // Create the path element and set its attributes
                    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    pathElement.setAttribute("stroke-linecap", "round");
                    pathElement.setAttribute("stroke-linejoin", "round");
                    pathElement.setAttribute("d", "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9");

                    // Append the path element to the SVG element
                    svgElement.appendChild(pathElement);

                    cell.appendChild(svgElement);
                }
                else {
                    cell.addEventListener("click", (event) => {
                        if (webGameController.isGameWon()) return;

                        let row = event.target.getAttribute('data-row');
                        let column = event.target.getAttribute('data-column');

                        webGameController.playTurn(row, column);
                    });
                }

                container.appendChild(cell);
            }
        }
    };

    const displayTurn = (player) => {
        textContainer.innerHTML = '';
        let textElement = document.createElement('p');
        textElement.textContent = player.name + "'s turn";
        textElement.classList.add('infoText');
        textContainer.appendChild(textElement);
    }

    const displayWinner = (player) => {
        textContainer.innerHTML = '';
        let textElement = document.createElement('p');
        textElement.textContent = "Winner is " + player.name;
        textElement.classList.add('infoText');
        textContainer.appendChild(textElement);
    };

    const displayTie = () => {
        textContainer.innerHTML = '';
        let textElement = document.createElement('p');
        textElement.textContent = "Tie";
        textElement.classList.add('infoText');
        textContainer.appendChild(textElement);
    };

    const displayReloadButton = () => {
        let button = document.createElement('button');
        button.addEventListener("click", function() {
            location.reload();
        });
        button.textContent = "Retry";
        button.classList.add('reloadButton');
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(button);
    };

    return { drawBoard, displayTurn, displayWinner, displayTie, displayReloadButton };
})();

const webGameController = (() => {
    const playerOne = playerFactory("X", "User");
    const playerTwo = playerFactory("O", "Computer");
    let currentPlayer = playerOne;
    let won = false;

    const isGameWon = () => { return won };

    const getCurrentPlayer = () => { return currentPlayer };
    const getUserPlayer = () => { return playerOne };
    const getComputerPlayer = () => { return playerTwo };

    const _changePlayer = () => {
        if (currentPlayer === playerOne) {
            currentPlayer = playerTwo;
        }
        else {
            currentPlayer = playerOne;
        }
    };

    const _winnerLogic = () => {
        let winner = gameBoard.checkWinner();

        if (winner !== null) {
            won = true;

            if (winner === "tie") {
                displayController.displayTie();
            }
            else {
                displayController.displayWinner(currentPlayer);
            }

            displayController.displayReloadButton();

            return true;
        }

        return false;
    };

    const playTurn = (row, column) => {
        // Player makes a move
        gameBoard.makeMove(currentPlayer, row, column);

        // display board
        displayController.drawBoard(gameBoard.getBoard());

        // check if game won => display winner
        if (_winnerLogic()) return;

        // Change player
        _changePlayer();

        // Update move label
        displayController.displayTurn(currentPlayer);

        // AI makes a move
        computerOpponent.makeMove(currentPlayer, gameBoard.getBoard());

        // display board
        displayController.drawBoard(gameBoard.getBoard());

        // check if game won => display winner
        if (_winnerLogic()) return;

        // Change player
        _changePlayer();

        // Update move label
        displayController.displayTurn(currentPlayer);
    };

    return { isGameWon, getCurrentPlayer, playTurn, getUserPlayer, getComputerPlayer };
})();

const computerOpponent = (() => {
    const _getAvailableMoves = (board) => {
        let moves = [];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    moves.push([i, j]);
                }
            }
        }

        return moves;
    };

    const _minimax = (board, maximizingPlayer) => {
        let score = _getHeuristic(board);

        if (score !== null) {
            return score;
        }

        if (maximizingPlayer) {
            let maxValue = -2;
            let moves = _getAvailableMoves(board);

            for (let i = 0; i < moves.length; i++) {
                gameBoard.makeMove(webGameController.getComputerPlayer(), moves[i][0], moves[i][1]);
                let currentValue = _minimax(gameBoard.getBoard(), false);
                gameBoard.undoMove(moves[i][0], moves[i][1]);
                maxValue = Math.max(maxValue, currentValue);
            }

            return maxValue;
        }
        else {
            let minValue = 2;
            let moves = _getAvailableMoves(board);

            for (let i = 0; i < moves.length; i++) {
                gameBoard.makeMove(webGameController.getUserPlayer(), moves[i][0], moves[i][1]);
                let currentValue = _minimax(gameBoard.getBoard(), true);
                gameBoard.undoMove(moves[i][0], moves[i][1]);
                minValue = Math.min(minValue, currentValue);
            }

            return minValue;
        }
    };

    const _isTerminal = (board) => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === " ") {
                    return false;
                }
            }
        }

        return true;
    };

    const _getHeuristic = (board) => {
        // Check rows and columns
        for (let i = 0; i < 3; i++) {
            if (board[i][0] !== " " && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
                return board[i][0] === "O" ? 1 : -1;
            }

            if (board[0][i] !== " " && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
                return board[0][i] === "O" ? 1 : -1;
            }
        }

        // Check diagonals
        if (board[0][0] !== " " && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
            return board[0][0] === "O" ? 1 : -1;
        }

        if (board[0][2] !== " " && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
            return board[0][2] === "O" ? 1 : -1;
        }

        if (_isTerminal(gameBoard.getBoard())) {
            return 0;
        }

        // No winner yet
        return null;
    };

    const makeMove = () => {
        let validMoves = _getAvailableMoves(gameBoard.getBoard());

        let maxHeuristic = -2; // -1 is the lowest possible value
        let moveIndex = 0;

        for (let i = 0; i < validMoves.length; i++) {
            gameBoard.makeMove(webGameController.getComputerPlayer(), validMoves[i][0], validMoves[i][1]);
            let currentHeuristic = _minimax(gameBoard.getBoard(), false);
            gameBoard.undoMove(validMoves[i][0], validMoves[i][1]);

            if (currentHeuristic > maxHeuristic) {
                maxHeuristic = currentHeuristic;
                moveIndex = i;
            }
        }

        let row = validMoves[moveIndex][0];
        let column = validMoves[moveIndex][1];

        gameBoard.makeMove(webGameController.getComputerPlayer(), row, column)
    };

    return { makeMove };
})();

displayController.drawBoard(gameBoard.getBoard());
displayController.displayTurn(webGameController.getCurrentPlayer());