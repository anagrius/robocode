import ActionTypes from './action_types';
import Dirs from './directions';
import {sample, partial, reduce} from 'lodash';
import {List} from 'immutable';

export function createAction(action, payload = {}) {
  return Object.assign(payload, {action});
}

export function idle() {
  return createAction(ActionTypes.IDLE);
}

function moveLeft() {
  return createAction(ActionTypes.MOVE, {direction: Dirs.WEST});
}

function moveRight() {
  return createAction(ActionTypes.MOVE, {direction: Dirs.EAST});
}

function moveUp() {
  return createAction(ActionTypes.MOVE, {direction: Dirs.NORTH});
}

function moveDown() {
  return createAction(ActionTypes.MOVE, {direction: Dirs.SOUTH});
}

export function moveRandomly() {
  return createAction(ActionTypes.MOVE, {direction: sample(Dirs)});
}

export function chargeShield() {
  return createAction(ActionTypes.CHARGE_SHIELD);
}

export function attack(direction) {
  return createAction(ActionTypes.ATTACK, {direction});
}

export function attackRandomly() {
  return attack(sample(Dirs));
}

export function randomAction() {
  const randomActions = [
    moveRandomly,
    chargeShield,
    attackRandomly
  ];
  return sample(randomActions)();
}

export function distanceBetween(pointA, pointB) {
  // Diagonals count as 1.
  return Math.max(Math.abs(pointA.x - pointB.x), Math.abs(pointA.y - pointB.y));
}

export function isEnemyAdjecent(me, enemy) {
  const distance = distanceBetween(me, enemy);
  return distance === 1;
}

export function getDirectionTo(me, enemy) {
  const isLeftOfEnemy = me.x > enemy.x;
  const isRightOfEnemy = me.x < enemy.x;
  const isBelowOfEnemy = me.y > enemy.y;
  const isAboveOfEnemy = me.y < enemy.y;

  if (isLeftOfEnemy) {
    if (isBelowOfEnemy) return Dirs.NORTH_WEST;
    if (isAboveOfEnemy) return Dirs.SOUTH_WEST;
    return Dirs.WEST;
  }
  else if (isRightOfEnemy) {
    if (isAboveOfEnemy) return Dirs.SOUTH_EAST;
    if (isBelowOfEnemy) return Dirs.NORTH_EAST;
    return Dirs.EAST;
  }
  else if (isAboveOfEnemy) {
    return Dirs.SOUTH;
  }
  else if (isBelowOfEnemy) {
    return Dirs.NORTH;
  }
  else {
    // target === destination, no direction
    return null
  }
}

export function getAdjecentEnemy(me, others) {
  const predicate = partial(isEnemyAdjecent, me);
  return new List(others).find(predicate) || null;
}

export function isNextToEnemy(me, others) {
  const enemy = getAdjecentEnemy(me, others);
  return enemy !== null;
}

export function attackAdjacentEnemy(me, others) {
  const enemy = getAdjecentEnemy(me, others);
  if (enemy) {
    const direction = getDirectionTo(me, enemy);
    return createAction(ActionTypes.ATTACK, {direction});
  }
  else {
    return attackRandomly();
  }
}

export function getClosestEnemy(me, others) {
  if (others.count() === 0) return null;
  const distanceToMe = partial(distanceBetween, me);
  return new List(others).minBy(distanceToMe);
}

export function moveToNearestEnemy(me, others) {
  if (others.count() === 0) return idle();

  const target = getClosestEnemy(me, others);
  const direction = getDirectionTo(me, target);

  return createAction(ActionTypes.MOVE, {direction});
}

export function avoidOppnents(me, others) {
  const closestEnemy = getClosestEnemy(me, others);
  if (!closestEnemy) return idle();
  const directionToEnemy = getDirectionTo(me, closestEnemy);
  return reverseDirection(directionToEnemy);
}

export function createFns(board = null, me = null, others = null) {
  const ACTION = 'ACTION';
  const UTIL = 'UTIL';

  return [
    {
      name: 'idle',
      fn: idle,
      doc: require('./docs/fns/idle.md'),
      category: ACTION,
    },
    {
      name: 'moveLeft',
      fn: moveLeft,
      category: ACTION,
    },
    {
      name: 'moveRight',
      fn: moveRight,
      category: ACTION,
    },
    {
      name: 'moveUp',
      fn: moveUp,
      category: ACTION,
    },
    {
      name: 'moveDown',
      fn: moveDown,
      category: ACTION,
    },
    {
      name: 'moveRandomly',
      fn: moveRandomly,
      category: ACTION,
    },
    {
      name: 'randomAction',
      fn: randomAction,
      category: ACTION,
    },
    {
      name: 'attack',
      fn: attack,
      category: ACTION,
    },
    {
      name: 'attackRandomly',
      fn: attackRandomly,
      category: ACTION,
    },
    {
      name: 'chargeShield',
      fn: chargeShield,
      category: ACTION,
    },
    {
      name: 'avoidOppnents',
      fn: partial(avoidOppnents, me, others),
      category: ACTION,
    },
    {
      name: 'moveToNearestEnemy',
      fn: partial(moveToNearestEnemy, me, others),
      category: ACTION,
    },
    {
      name: 'attackAdjacentEnemy',
      fn: partial(attackAdjacentEnemy, me, others),
      category: ACTION,
    },

    // Utils

    {
      name: "getClosestEnemy",
      fn: partial(getClosestEnemy, me, others),
      category: UTIL,
    },
    {
      name: 'isNextToEnemy',
      fn: partial(isNextToEnemy, me, others),
      category: UTIL,
    },
    {
      name: 'getAdjecentEnemy',
      fn: partial(getAdjecentEnemy, me, others),
      category: UTIL,
    },
    {
      name: 'isEnemyAdjecent',
      fn: partial(isEnemyAdjecent, me),
      category: UTIL,
    },
    {
      name: 'distanceTo',
      fn: partial(distanceBetween, me),
      category: UTIL,
    },
    {
      name: 'getDirectionTo',
      fn: partial(getDirectionTo, me),
      category: UTIL,
    }
  ];
}

export function createAI(board, me, others) {
  const fns = createFns(board, me, others);
  return fns.reduce((result, item) => {
    result[item.name] = item.fn;
    return result;
  }, {});
}
