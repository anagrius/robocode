import Dirs, * as directions from '../../src/engine/directions.js';
import {keys, reverse} from 'lodash';

const orderedDirs = [
  Dirs.NORTH,
  Dirs.NORTH_EAST,
  Dirs.EAST,
  Dirs.SOUTH_EAST,
  Dirs.SOUTH,
  Dirs.SOUTH_WEST,
  Dirs.WEST,
  Dirs.NORTH_WEST,
  ];

describe('Directions', () => {

  describe('#reverseDirection', () => {
    it('to be transitive', () => {
      const data = [
        [Dirs.NORTH, Dirs.SOUTH],
        [Dirs.NORTH_WEST, Dirs.SOUTH_EAST],
        [Dirs.EAST, Dirs.WEST],
        [Dirs.SOUTH_WEST, Dirs.NORTH_EAST]
      ];

      for (let d of data) {
        const d1 = d[0];
        const d2 = d[1];
        expect(directions.reverseDirection(d1)).toEqual(d2);
        expect(directions.reverseDirection(d2)).toEqual(d1);
      }
    });
  });

  describe('#nextDirectionClockwise', () => {
    it('to return the next direction to the given direction in cw order', () => {
      const data = [
        [Dirs.NORTH, Dirs.NORTH_EAST],
        [Dirs.NORTH_EAST, Dirs.EAST],
        [Dirs.EAST, Dirs.SOUTH_EAST],
        [Dirs.SOUTH_EAST, Dirs.SOUTH],
        [Dirs.SOUTH, Dirs.SOUTH_WEST],
        [Dirs.SOUTH_WEST, Dirs.WEST],
        [Dirs.WEST, Dirs.NORTH_WEST],
        [Dirs.NORTH_WEST, Dirs.NORTH]
      ];

      data.forEach(([direction, expected]) => {
        const nextDir = directions.nextDirectionClockwise(direction);
        expect(nextDir).toEqual(expected, `${direction} -> ${nextDir}, expected ${expected}`);
      });
    });

    it('throws an exception if the direction is invalid', () => {
      expect(() => directions.nextDirectionClockwise("INWARDS")).toThrow();
    });
  });

  describe('#nextDirectionCounterClockwise', () => {
    it('to return the next direction to the given direction in ccw order', () => {
      const data = [
        [Dirs.NORTH, Dirs.NORTH_WEST],
        [Dirs.NORTH_WEST, Dirs.WEST],
        [Dirs.WEST, Dirs.SOUTH_WEST],
        [Dirs.SOUTH_WEST, Dirs.SOUTH],
        [Dirs.SOUTH, Dirs.SOUTH_EAST],
        [Dirs.SOUTH_EAST, Dirs.EAST],
        [Dirs.EAST, Dirs.NORTH_EAST],
        [Dirs.NORTH_EAST, Dirs.NORTH]
      ];

      data.forEach(([direction, expected]) => {
        const nextDir = directions.nextDirectionCounterClockwise(direction);
        expect(nextDir).toEqual(expected, `${direction} -> ${nextDir}, expected ${expected}`);
      });
    });

    it('throws an exception if the direction is invalid', () => {
      expect(() => directions.nextDirectionClockwise("INWARDS")).toThrow();
    });
  });


});
