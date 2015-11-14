import React from 'react';
import {toCoords} from '../boards';
import {winner} from '../engine';

require('./renderer.css')

const boardSize = 500;

function renderRobot(game, robotId, showHealth = true) {
  return (
    <div className="robot">
      {showHealth && <div className="robot__health">{game.robots.get(robotId).health}</div>}
      <img className="robot__img" src={require(`./images/robot-${robotId+1}.svg`)} />
    </div>
  );
}

function renderCell(game, tileSize, {x, y}, robotId) {
  const robot = (robotId !== null) ? renderRobot(game, robotId) : <div>({x},{y})</div>;
  return <div style={{width: tileSize, height: tileSize}} className="board__cell" key={`${x}$${y}`}>{robot}</div>;
}

// HACK: Render initial frame only. This does against React's prop model.
let started = false;

export default function render(game, reset) {
  const {board} = game;
  const cellWidth = Math.floor(boardSize / board.boardSize);
  let boardClass = "board";
  if (!started) {
    started = true;
  }
  else {
    boardClass = boardClass + " board--started";
  }

  const winnerRobot = winner(game);
  const hasWinner = (winnerRobot !== null);

  return (
    <div className={boardClass}>
      {board.tiles.map((tileValue, idx) => {
        const coords = toCoords(board, idx);
        return renderCell(game, cellWidth, coords, tileValue);
      })}
      <div className="board__fight">Fight!</div>
      {hasWinner && (
        <div className="board__winner">
          <div className="winner">
            <span>Winner</span>
            {hasWinner && renderRobot(game, winnerRobot, false)}
          </div>
          <div className="board__winner-controls">
            <button onClick={reset}>Reset Game</button>
          </div>
        </div>
      )}
    </div>
  );
}
