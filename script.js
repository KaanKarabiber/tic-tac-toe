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
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: 1
    },
    {
      name: playerTwoName,
      token: 2
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
      if (isDraw(board)) {
        console.log("It's a draw!");
        printNewRound();
        return; 
      }
      switchPlayerTurn();
      printNewRound();
    }
    
  }
  // initial board
  printNewRound();

  return{
    playRound,
    getActivePlayer
  }
}
const game = GameController();

