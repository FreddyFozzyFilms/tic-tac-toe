import * as React from 'react';
import './style.css';

function Board(props) {
  const { mat, onChange } = props;

  const repr = (elem) => {
    if (elem == -1) return '';
    return elem == 1 ? 'x' : 'o';
  };

  return (
    <div>
      {mat.map((row, rindex) => (
        <div className="board-row">
          {row.map((elem, eindex) => (
            <button className="square" onClick={() => onChange(rindex, eindex)}>
              {repr(elem)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// board state is controlled by the App component
// via useState hook attached to the board matrix
export default function App() {
  // const [board, setBoard] = React.useState([
  //   [-1, -1, -1],
  //   [-1, -1, -1],
  //   [-1, -1, -1],
  // ]);

  const N = 4;

  const [board, setBoard] = React.useState(Array(N).fill(Array(N).fill(-1)));

  const [turn, setTurn] = React.useState(0);
  // 0 for player 0 turn
  // 1 for player 1 turn

  const [win, setWin] = React.useState(false);

  const checkWin = (boardVal, turn) => {
    let checkRow = (i) => {
      for (let j = 0; j < N; j++) {
        if (boardVal[i][j] != turn) return false;
      }
      return true;
    };
    let checkColumn = (j) => {
      for (let i = 0; i < N; i++) {
        if (boardVal[i][j] != turn) return false;
      }
      return true;
    };
    let checkDiagL = () => {
      // left diagonal
      for (let i = 0; i < N; i++) {
        if (boardVal[i][i] != turn) return false;
      }
      return true;
    };
    let checkDiagR = () => {
      // right diagonal
      for (let i = 0; i < N; i++) {
        if (boardVal[i][N - i] != turn) return false;
      }
    };
    for (let x = 0; x < N; x++) {
      if (checkRow(x) || checkColumn(x)) return true;
    }
    if (checkDiagL() || checkDiagR()) return true;
    return false;
  };

  const isFull = (boardVal) => {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (boardVal[i][j] == -1) return false;
      }
    }
    return true;
  };

  return (
    <div>
      {isFull(board) ? (
        <h1>Tie</h1>
      ) : (
        <h1>
          {win ? `Player ${(turn + 1) % 2} YOU WIN!` : `Player ${turn}'s turn`}
        </h1>
      )}
      <Board
        mat={board}
        onChange={
          win
            ? (r, e) => {
                return;
              }
            : (r, e) => {
                setBoard((prev) => {
                  let newBoard = prev.map((row, rindex) =>
                    row.map((elem, eindex) => {
                      if (eindex != e || rindex != r) return elem;
                      if (elem == -1) {
                        setTurn((turn + 1) % 2); // switchs turns only if a valid move was made
                        return turn;
                      }
                      return elem;
                    })
                  );
                  // we don't need to worry about turn not being upated because we want the turn of the player who just went and not the turn of the next player
                  setWin(checkWin(newBoard, turn));
                  return newBoard;
                });
              }
        }
      />
    </div>
  );
}
