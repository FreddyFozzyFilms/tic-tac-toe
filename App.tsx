import * as React from 'react';
import './style.css';

import Board from './components/Board';

import { GameState, isWin, isFull, updateGameState } from './GameLogic';

interface PvPProps {
  N: number;
}
function PvP(props: PvPProps) {
  const { N } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

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
                setGameState((gs) =>
                  updateGameState(gs, [r, e]) ? updateGameState(gs, [r, e]) : gs
                );
              }
        }
      />
    </div>
  );
}

interface PvAiProps {
  N: number;
  strategy: (gs: GameState) => [number, number];
}
function PvAi(props: PvAiProps) {
  const { N, strategy } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

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
                setGameState((gs) => {
                  let gs1 = updateGameState(gs, [r, e]);
                  if (!gs1) return gs; // no more changes if player move is invalid

                  let gs2 = updateGameState(gs1, strategy(gs1));
                  if (!gs2) return gs1; // no more changes if ai move is invalid
                  return gs2;
                });
              }
        }
      />
    </div>
  );
}

interface AivAiProps {
  N: number;
  strategys: [
    (gs: GameState) => [number, number],
    (gs: GameState) => [number, number]
  ];
}
function AivAi(props: AivAiProps) {
  const { N, strategys } = props;

  const [gameState, setGameState] = React.useState<GameState>({
    board: Array(N).fill(Array(N).fill(-1)),
    lastMove: [-1, -1],
    turn: 0,
  });

  // so entire game state resets everytime component remounts
  React.useEffect(() => {
    setGameState({
      board: Array(N).fill(Array(N).fill(-1)),
      lastMove: [-1, -1],
      turn: 0,
    });
  }, [N]);

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
      <Board mat={gameState.board} onChange={() => {}} />
      <button
        onClick={() => {
          setGameState((gs) =>
            updateGameState(gs, strategys[gs.turn](gs))
              ? updateGameState(gs, strategys[gs.turn](gs))
              : gs
          );
        }}
      >
        Next Move
      </button>
    </div>
  );
}

// board state is controlled by the App component
// via useState hook attached to the board matrix
export default function App() {
  const [mode, setMode] = React.useState<number>(0);

  function naiveStrat(gs: GameState): [number, number] {
    let N = gs.board.length;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        if (gs.board[i][j] == -1) return [i, j];
      }
    }
  }
  return (
    <div>
      <button onClick={() => setMode((prev) => (prev + 1) % 3)}>
        {['P v P', 'P v Ai', 'Ai v Ai'][mode]}
      </button>
      {
        [
          <PvP N={4} />,
          <PvAi N={4} strategy={naiveStrat} />,
          <AivAi N={4} strategys={[naiveStrat, naiveStrat]} />,
        ][mode]
      }
    </div>
  );
}
