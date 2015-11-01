import {List, Record, Range, Repeat} from 'immutable';
import {range, random} from 'lodash';

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
  place: function(id, x, y) {
    const tile = toTileIndex(this, x, y);
    return this.update('tiles', ts => ts.set(tile, id));
  },
  valueAt: function(x, y) {
    const index = toTileIndex(this, x, y);
    return this.tiles.get(index);
  },
  positionOf: function(id) {
    const index = this.tiles.indexOf(id);
    console.log("ind", index);
    return index === -1 ? null : toCoords(this, index);
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
