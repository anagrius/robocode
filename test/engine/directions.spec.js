import Dirs, {reverseDirection} from '../../src/engine/directions.js';

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
        expect(reverseDirection(d1)).toEqual(d2);
        expect(reverseDirection(d2)).toEqual(d1);
      }
    });
  });
});
