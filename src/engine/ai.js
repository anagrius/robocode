import ActionTypes from './action_types';
import Dirs from './directions';
import {sample, partial} from 'lodash';
import {List} from 'immutable';

export function createAction(action, payload = {}) {
  return Object.assign(payload, {action});
}

function doNothing() {
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

export function attackRandomly() {
  return createAction(ActionTypes.ATTACK, {direction: sample(Dirs)});
}

export function randomAction() {
  const randomActions = [
    moveRandomly,
    chargeShield,
    attackRandomly
  ];
  return sample(randomActions)();
}

export function distanceBetween(robotA, robotB) {
  // Diagonals count as 1.
  return Math.max(Math.abs(robotA.x - robotB.x), Math.abs(robotA.y - robotB.y));
}

export function isEnemyAdjecent(robot, enemy) {
  const distance = distanceBetween(robot, enemy);
  return distance === 1;
}

export function getDirectionTo(robot, enemy) {

  if (robot.x > enemy.x && robot.y > enemy.y) {
    return Dirs.NORTH_WEST;
  }
  else if (robot.x > enemy.x && robot.y < enemy.y) {
    return Dirs.SOUTH_WEST;
  }
  else if (robot.x < enemy.x && robot.y < enemy.y) {
    return Dirs.SOUTH_EAST;
  }
  else if (robot.x < enemy.x && robot.y > enemy.y) {
    return Dirs.NORTH_EAST;
  }
  else if (robot.x > enemy.x) {
    return Dirs.WEST;
  }
  else if (robot.x < enemy.x) {
    return Dirs.EAST;
  }
  else if (robot.y > enemy.y) {
    return Dirs.NORTH;
  }
  else if (robot.y < enemy.y) {
    return Dirs.SOUTH;
  }
  else {
    return null;
  }
}

export function getAdjecentEnemy(robot, enemies) {
  const predicate = partial(isEnemyAdjecent, robot);
  return new List(enemies).find(predicate) || null;
}

export function isNextToEnemy(robot, enemies) {
  const enemy = getAdjecentEnemy(robot, enemies);
  return enemy !== null;
}

export function attackAdjacentEnemy(robot, enemies) {
  const enemy = getAdjecentEnemy(robot, enemies);
  if (enemy) {
    const direction = getDirectionTo(robot, enemy);
    return createAction(ActionTypes.ATTACK, {direction});
  }
  else {
    return attackRandomly();
  }
}

export function moveToNearestEnemy(myRobot, otherRobots) {
  if (otherRobots.count() === 0) return idle();

  const distanceToMe = partial(distanceBetween, myRobot);
  const target = new List(otherRobots).minBy(distanceToMe);

  const direction = getDirectionTo(myRobot, target);

  return createAction(ActionTypes.MOVE, {direction});
}

export function idle() {
  return createAction(ActionTypes.IDLE);
}

export default {
  randomAction,
  attackRandomly,
  chargeShield,
  moveRandomly,
  moveToNearestEnemy,
  attackAdjacentEnemy,
  isNextToEnemy,
  getDirectionTo,
  idle
};
