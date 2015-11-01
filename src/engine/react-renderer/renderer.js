import React from 'react';
import {toCoords} from '../board';

require('./renderer.css')

const boardSize = 600;

function renderCell(tileSize, {x, y}, robotId) {
  const robot = (robotId !== null) ? (
    <div className="robot">
      <div className="robot__health"></div>
      <img className="board__robot" src={require('./images/robot-1.svg')} />
    </div>
  ) : <div>({x},{y})</div>;
  return <div style={{width: tileSize, height: tileSize}} className="board__cell" key={`${x}$${y}`}>{robot}</div>;
}

export default function render(game) {
  const {board} = game;
  const cellWidth = Math.floor(boardSize / board.boardSize);
  return (
    <div className="board">
      {board.tiles.map((tileValue, idx) => {
        const coords = toCoords(board, idx);
        return renderCell(cellWidth, coords, tileValue);
      })}
    </div>
  );
}
