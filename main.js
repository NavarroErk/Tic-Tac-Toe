// Game board module
const gameBoard = (function () {
    const board = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        const gameboard = document.querySelector("#gameboard");
        gameboard.innerHTML = "";
        board.forEach((element, index) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("key-index", index);
            tile.textContent = element;
            gameboard.appendChild(tile);
        });
    }

    return {
        render,
        board // Expose the board array for checking win conditions
    };
})();

// Player factory function
function createPlayer(name, mark) {
    return {
        name,
        mark
    };
}

// Game controls module
const gameControls = (function () {
    let players = [];
    let currentPlayerIndex;
    let gameOver;
    let player1Mark = "";
    let player2Mark = "";

    const markBtns = document.querySelectorAll(".mark-btn");
    markBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelector("#mark-x-btn").style.backgroundColor = "lightGray";
            document.querySelector("#mark-o-btn").style.backgroundColor = "lightGray";
            btn.style.backgroundColor = "var(--secondary-color)";
            player1Mark = btn.textContent;
            player2Mark = (player1Mark === "X") ? "O" : "X";
        });
    });

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1-input").value, player1Mark),
            createPlayer(document.querySelector("#player2-input").value, player2Mark)
        ];

        if (players[0].name === players[1].name) {
            alert("Both player names cannot match");
            return;
        } else if (player1Mark === "") {
            alert("Player 1: Please choose a mark.");
            return;
        }

        // Display player information and setup game
        displayPlayerInfo();
        initializeGame();
    };

    const displayPlayerInfo = () => {
        document.querySelector("#player-info-container").style.display = "flex";
        document.querySelector("#gameboard").style.display = "grid";
        document.querySelector("#game-controls").style.display = "none";
        document.querySelector("#player1-name").textContent += ` ${players[0].name}`;
        document.querySelector("#player1-mark").textContent += ` ${players[0].mark}`;
        document.querySelector("#player2-name").textContent += ` ${players[1].name}`;
        document.querySelector("#player2-mark").textContent += ` ${players[1].mark}`;
    };

    const initializeGame = () => {
        currentPlayerIndex = Math.round(Math.random());
        document.querySelector("#player-turn").textContent = `It is ${players[currentPlayerIndex].name}'s turn`;
        gameOver = false;
        gameBoard.render();

        const tiles = document.querySelectorAll(".tile");

        tiles.forEach((tile, index) => {
            tile.addEventListener("click", () => {
                if (!tile.textContent && !gameOver) {
                    tile.textContent = players[currentPlayerIndex].mark;
                    gameBoard.board[index] = players[currentPlayerIndex].mark;
                    console.log(gameBoard.board);

                    if (checkForWin()) {
                        document.querySelector("#player-turn").textContent = `${players[currentPlayerIndex].name} wins!`;
                        // document.querySelector("#new-game-btn").style.display = "flex"
                        gameOver = true;
                    } else if (gameBoard.board.every((cell) => cell !== "")) {
                        document.querySelector("#player-turn").textContent = "It's a draw!";
                        // document.querySelector("#new-game-btn").style.display = "flex"
                        gameOver = true;
                    } else {
                        currentPlayerIndex = 1 - currentPlayerIndex;
                        document.querySelector("#player-turn").textContent = `It is ${players[currentPlayerIndex].name}'s turn`;
                    }
                }
            });
        });
    };

    function checkForWin() {
        const winCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];
    
        for (const combination of winCombinations) {
            const [a, b, c] = combination;
            if (gameBoard.board[a] && gameBoard.board[a] === gameBoard.board[b] && gameBoard.board[b] === gameBoard.board[c]) {
                return true; // A player has won
            }
        }
    
        return false; // No player has won
    }
    // Function to check for a win - you need to implement this

    return start;
})();

// Event listener for starting the game
const startGameBtn = document.querySelector("#start-game-btn");
startGameBtn.addEventListener("click", () => {
    gameControls();
});

const newGameBtn = document.querySelector("#new-game-btn");