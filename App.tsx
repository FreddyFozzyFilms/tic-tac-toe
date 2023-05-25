import * as React from 'react';
import './style.css';

import Board from './components/Board';

import { GameState, isWin, isFull, updateGameState } from './GameLogic';

// board state is controlled by the App component
// via useState hook attached to the board matrix
export default function App() {
  // const [board, setBoard] = React.useState([
  //   [-1, -1, -1],
  //   [-1, -1, -1],
  //   [-1, -1, -1],
  // ]);

  const N = 4;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  return (
    <div>
      {isFull(gameState.board) && !isWin(gameState) ? (
        <h1>Tie</h1>
      ) : (
        <h1>
          {isWin(gameState)
            ? `Player ${(gameState.turn + 1) % 2} YOU WIN!`
            : `Player ${gameState.turn}'s turn`}
        </h1>
      )}
      <Board
        mat={gameState.board}
        onChange={
          isWin(gameState)
            ? (r, e) => {}
            : (r, e) => {
                setGameState((gs) => updateGameState(gs, [r, e]));
              }
        }
      />
    </div>
  );
}
