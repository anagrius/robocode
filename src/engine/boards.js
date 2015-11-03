import {List, Record, Range, Repeat} from 'immutable';
import {range, random} from 'lodash';
import * as Dirs from './directions';
import invariant from 'invariant';

const Coordinate = Record({x: 0, y: 0});

function toTileIndex(board, x, y) {
  return x + y * board.boardSize;
}

export function toCoords(board, tileIndex) {
  const y = Math.floor(tileIndex / board.boardSize);
  const x = tileIndex - y * board.boardSize;
  return new Coordinate({x, y});
}

const Board = Record({
  boardSize: 0,
  tiles: [],
  isInBounds(x, y) {
    const size = this.boardSize;
    return (x < 0 || x >= size || y < 0 || y >= size);
  },
  place: function(id, x, y) {
    invariant(!this.isInBounds(x, y), `position out of bounds (${x},${y})`);
    const tile = toTileIndex(this, x, y);
    return this.update('tiles', ts => ts.set(tile, id));
  },
  valueAt: function(x, y) {
    const index = toTileIndex(this, x, y);
    return this.tiles.get(index);
  },
  positionOf: function(id) {
    const index = this.tiles.indexOf(id);
    return index === -1 ? null : toCoords(this, index);
  },
  getAdjacentCell(x, y, direction) {

    const moves = {
      [Dirs.WEST]: (x,y) => ({x: x - 1, y}),
      [Dirs.NORTH_EAST]: (x,y) => ({x: x + 1, y: y - 1}),
      [Dirs.EAST]: (x,y) => ({x: x + 1, y}),
      [Dirs.SOUTH_EAST]: (x,y) => ({x: x + 1, y: y + 1}),
      [Dirs.NORTH]: (x,y) => ({x, y: y - 1}),
      [Dirs.NORTH_WEST]: (x,y) => ({x: x - 1, y: y - 1}),
      [Dirs.SOUTH]: (x,y) => ({x, y: y + 1}),
      [Dirs.SOUTH_WEST]: (x,y) => ({x: x - 1, y: y + 1}),
    };

    const newCoords = moves[direction](x,y);

    if (newCoords) {
      const {x, y} = newCoords;
      if (x >= this.boardSize || x < 0 || y >= this.boardSize || y < 0) {
        return null
      }
      else {
        return newCoords;
      }
    }

    throw new Error(`unknown direction '${direction}'`);
  },
  isCellEmpty(x, y) {
    return this.valueAt(x, y) === null;
  }
});

export function createBoard(size) {
  return new Board({
    boardSize: size,
    tiles: new List(Repeat(null, size * size))
  });
}

export default {
  createBoard,
  toCoords
};
