function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;

    const placeMark = (row, column, player) =>{
      const availableCells = board.map((row) => row.filter((cell) => cell.getValue() === 0));
   
      if (!availableCells.length) return;
      if (board[row][column].getValue() !== 0) {
        console.log("Invalid move! Cell is already occupied.");
        return false; 
      }
      board[row][column].addToken(player);    
      return true;
    }
    
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
      console.log(boardWithCellValues);
    };
    return {getBoard, placeMark, printBoard}
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;
  
  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "X",
  playerTwoName = "O"
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: 1,
    },
    {
      name: playerTwoName,
      token: 2,
    }
  ];
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const allEqual = (arr) => arr.every((value) => value !== 0 && value === arr[0]);
  
  const isDraw = () => {
    return board.getBoard().every((row) =>
      row.every((cell) => cell.getValue() !== 0)
    );
  };

  const checkWin = () => {
    const grid = board.getBoard();
    for (let row of grid) {
      if (allEqual(row.map((cell) => cell.getValue()))) return true;     
    }

    for (let col = 0; col < 3; col++) {
      const column = grid.map((row) => row[col].getValue());
      if (allEqual(column)) return true;  
    }

    const diagonal1 = [0, 1, 2].map((i) => grid[i][i].getValue());
    const diagonal2 = [0, 1, 2].map((i) => grid[i][2 - i].getValue()); 
    if (allEqual(diagonal1) || allEqual(diagonal2)) return true; 
    
    return false;
  }

  const playRound = (row, column) => {
    console.log(
      `Marking ${getActivePlayer().name}'s token into row ${row}, column ${column}`
    );
    const moveValid = board.placeMark(row, column, getActivePlayer().token);

    if(moveValid){
      if(checkWin()){
        console.log(`${getActivePlayer().name} wins!`);
        printNewRound();
        return;
      }
      if (isDraw()) {
        console.log("It's a draw!");
        printNewRound();
        return; 
      }
      switchPlayerTurn();
      printNewRound();
    }
    
  }
  printNewRound();

  return{
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    checkWin,
    isDraw
  }
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const restartButton = document.querySelector('.restart');

  const updateScreen = () => {
    boardDiv.textContent = "";
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
 
    board.forEach((row, indexRow) => {  
      row.forEach((cell, indexCol) => {   
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = indexRow;
        cellButton.dataset.column = indexCol;
        boardDiv.appendChild(cellButton);

        const icons = document.createElement("img");
        if (cell.getValue() === 1) icons.src = "icons/close-thick.svg";
        else if (cell.getValue() === 2)  icons.src = "icons/circle-outline.svg";
        cellButton.append(icons);       
      });
    });   
    if (game.checkWin()) {
      if (!document.querySelector(".end-game-message")) { 
        const endGameMessage = document.createElement("p");
        const endGameMessageDiv = document.createElement("div");
  
        endGameMessage.classList.add("end-game-message");
        endGameMessage.textContent = `${game.getActivePlayer().name} wins!`;
  
        endGameMessageDiv.append(endGameMessage);
        document.body.appendChild(endGameMessageDiv);
      }
  
      // Disable all buttons once the game is over
      const buttons = document.querySelectorAll(".cell");
      buttons.forEach((button) => button.disabled = true);
    }
    if (game.isDraw() && !game.checkWin()){
      const endGameMessage = document.createElement("p");
      const endGameMessageDiv = document.createElement("div");
  
      endGameMessage.classList.add("end-game-message");
      endGameMessage.textContent = `Draw!`;
      
      document.body.appendChild(endGameMessageDiv);
      endGameMessageDiv.append(endGameMessage);
    }
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    
    if (!selectedColumn && !selectedRow) return;
    
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  function restartGame() {
    const newGame = GameController();
    game.playRound = newGame.playRound; 
    game.getActivePlayer = newGame.getActivePlayer;
    game.getBoard = newGame.getBoard;
    game.checkWin = newGame.checkWin;
    game.isDraw = newGame.isDraw;
    const EndGameMessage = document.querySelector(".end-game-message");
    if (EndGameMessage) EndGameMessage.remove();
    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  restartButton.addEventListener("click", restartGame);

  updateScreen();
}

ScreenController();
