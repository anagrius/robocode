import actions from '../../src/engine/actions.js';
import Dirs from '../../src/engine/directions.js';
import * as AI from '../../src/engine/ai.js';
import {x0y0, x0y1, x1y0, x1y1} from './helpers.js'

describe('AI', () => {
  describe('#getClosestEnemy', () => {
    it('gets the closest enemy', () => {
      expect("Not implemented").toEqual("implemented");
    });
  });

  describe('#getDirectionTo', () => {
    it('returns a direction that leads to the point', () => {
      const scenarios = [
        [x0y0, x0y1, Dirs.SOUTH],
        [x0y0, x1y1, Dirs.SOUTH_EAST],
        [x0y0, x1y0, Dirs.EAST],
        [x1y0, x0y1, Dirs.SOUTH_WEST],
        [x1y1, x0y1, Dirs.WEST],
        [x1y1, x0y0, Dirs.NORTH_WEST],
        [x1y1, x1y0, Dirs.NORTH],
        [x0y1, x1y0, Dirs.NORTH_EAST],
      ];

      scenarios.forEach(([from, to, expectedDir]) => {
        const direction = AI.getDirectionTo(from, to);
        expect(direction).toEqual(expectedDir, `(${from.x} ${from.y}) -> (${to.x}, ${to.y}), got: ${direction}, expected: ${expectedDir}`);
      });
    });

    it('returns null if (x1,y1) === (x2,y2)', () => {
      const direction = AI.getDirectionTo(x1y1, x1y1);
      expect(direction).toEqual(null);
    });
  });

  describe('#isEnemyAdjecent', () => {
    it('returns true if the enemy is adjecent on the diagonal', () => {

    })
  });
});
