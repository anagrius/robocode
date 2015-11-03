import actions from '../../src/engine/actions.js';
import boards from '../../src/engine/boards.js';
import Dirs from '../../src/engine/directions.js';
import {x0y0, x0y1, x1y0, x1y1} from './helpers.js'

describe('Boards', () => {
  const robot = 666;
  const enemy = 777;

  let board;

  beforeEach(() => {
    board = boards.createBoard(2);
  });

  describe('#valueAt', () => {
    it('returns null for positions without an item', () => {
      const v = board.valueAt(0, 0);
      expect(v).toBe(null);
    });

    it('returns the item at the position', () => {
      board = board.place(robot, 1, 1);
      expect(board.valueAt(1, 1)).toBe(robot);
    });
  });

  describe('#positionOf', () => {
    it('returns the coodinates of the item', () => {
      board = board.place(robot, 1, 0);
      const {x, y} = board.positionOf(robot);
      expect(x).toEqual(1);
      expect(y).toEqual(0);
    });

    it('returns null if the item is not found', () => {
      const pos = board.positionOf(enemy);
      expect(pos).toBe(null);
    });
  });

  describe('#place', () => {
    it('does not allow a robot to move outside the board', () => {
      const outOfBounds = [[-1, 0], [0, -1], [2, 0], [0, 2]];
      const withinBounds = [[0, 0], [1, 0], [0, 1], [1, 1]];
      outOfBounds.forEach(([x,y]) => expect(() => board.place(robot, x, y)).toThrow());
      withinBounds.forEach(([x,y]) => expect(() => board.place(robot, x, y)).toNotThrow());
    });

    it('should update the board with the value, overriding existing', () => {
      board = board.place(robot, 0, 0).place(enemy, 0, 0);
      expect(board.valueAt(0, 0)).toEqual(enemy);
    });
  });

  describe('#isCellEmpty', () => {
    it('returns true if the cell is empty', () => {
      expect(board.isCellEmpty(0,0)).toBe(true);
    });
  });

  describe('#getAdjacentCell', () => {
    it('returns null if there is no cell in the direction', () => {
      const cell = board.getAdjacentCell(0, 0, Dirs.WEST);
      expect(cell).toBe(null);
    });

    it('returns the {x,y} if there is a cell in the direction', () => {
      const data = [
        [x0y0, Dirs.NORTH, null],
        [x1y1, Dirs.NORTH, x1y0],
        [x0y0, Dirs.NORTH_EAST, null],
        [x0y1, Dirs.NORTH_EAST, x1y0],
        [x0y0, Dirs.EAST, x1y0],
        [x1y0, Dirs.EAST, null],
        [x1y1, Dirs.SOUTH_EAST, null],
        [x0y0, Dirs.SOUTH_EAST, x1y1],
        [x0y1, Dirs.SOUTH, null],
        [x1y0, Dirs.SOUTH, x1y1],
        [x0y1, Dirs.SOUTH_WEST, null],
        [x1y0, Dirs.SOUTH_WEST, x0y1],
        [x0y0, Dirs.WEST, null],
        [x1y0, Dirs.WEST, x0y0],
        [x0y0, Dirs.NORTH_WEST, null],
        [x1y1, Dirs.NORTH_WEST, x0y0],
      ];

      data.forEach(senario => {
        const [from, direction, to] = senario;
        const target = board.getAdjacentCell(from.x, from.y, direction);
        expect(target).toEqual(to);
      });
    });

    it('throws an exception if the direction is unknown', () => {
      expect(() => board.getAdjacentCell(0, 0, 'STARBOARD')).toThrow();
    });
  });
});
