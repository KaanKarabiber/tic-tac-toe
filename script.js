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
      
      board[row][column].addToken(player);
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
  // const setValue = (x) => value = x;
  return {
    addToken,
    getValue,
    // setValue
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

  const playRound = (row, column) => {
    // Drop a token for the current player
    console.log(
      `Marking ${getActivePlayer().name}'s token into row ${row}, column ${column}`
    );
    board.placeMark(row, column, getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  }
  // initial board
  printNewRound();

  return{
    playRound,
    getActivePlayer
  }
}
const game = GameController();

