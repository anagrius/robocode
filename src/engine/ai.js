import {Actions, Directions} from './actions';
import {sample, partial} from 'lodash';
import {List} from 'immutable';

export function createAction(action, payload = {}) {
  return Object.assign(payload, {action});
}

function doNothing() {
  return createAction(Actions.IDLE);
}

function moveLeft() {
  return createAction(Actions.MOVE, {direction: Directions.LEFT});
}

function moveRight() {
  return createAction(Actions.MOVE, {direction: Directions.RIGHT});
}

function moveUp() {
  return createAction(Actions.MOVE, {direction: Directions.UP});
}

function moveDown() {
  return createAction(Actions.MOVE, {direction: Directions.DOWN});
}

export function moveRandomly() {
  return createAction(Actions.MOVE, {direction: sample(Directions)});
}

export function chargeShield() {
  return createAction(Actions.CHARGE_SHIELD);
}

export function attackRandomly() {
  return createAction(Actions.ATTACK, {direction: sample(Directions)});
}

export function randomAction() {
  const randomActions = [
    moveRandomly,
    chargeShield,
    attackRandomly
  ];
  return sample(randomActions)();
}

function distanceBetween(robotA, robotB) {
  const A = Math.pow(robotA.x - robotB.x, 2);
  const B = Math.pow(robotA.y - robotB.y, 2);
  const distance = Math.sqrt(A + B);
  return distance;
}

export function moveToNearestEnemy(myRobot, otherRobots) {
  const distanceToMe = partial(distanceBetween, myRobot);
  const target = new List(otherRobots).minBy(distanceToMe);

  // TODO: Naive implementation, we should use the diagonal for the path.

  console.log(`${myRobot.id} = (${myRobot.x}, ${myRobot.y}), ${target.id} = (${target.x}, ${target.y})`)

  if (target.x > myRobot.x) {
    console.log("move r")
    return moveRight();
  }
  else if (target.x < myRobot.x) {
    console.log("move l")
    return moveLeft();
  }
  else if (target.y < myRobot.y) {
    console.log("move d")
    return moveUp();
  }
  else {
    console.log("move u")
    return moveDown();
  }
}

export default {
  randomAction,
  attackRandomly,
  chargeShield,
  moveRandomly,
  moveToNearestEnemy
};
