import {List} from 'immutable';
import {sample} from 'lodash';
import ActionTypes from './action_types';
import Directions from './directions';

function move(game, {robotId, direction}) {
  const {board} = game;
  const coords = board.positionOf(robotId);
  const {x, y} = coords;

  const newCoords = board.getAdjacentCell(x, y, direction);

  if (newCoords && board.isCellEmpty(newCoords.x, newCoords.y)) {
    return game.update("board", b => b.place(null, x, y).place(robotId, newCoords.x, newCoords.y));
  }
  else {
    // If for instance we are on the left border and
    // try to move left. Nothing happens.
    return game;
  }
}

function decreaseRobotHealth(game, robotId, health) {
  return game.updateIn(['robots', robotId, 'health'], h => {
    return h - health;
  });
}

function attack(game, {robotId, direction}) {
  const {board} = game;
  const {x, y} = board.positionOf(robotId);
  const cell = board.getAdjacentCell(x, y, direction);

  if (cell !== null && !board.isCellEmpty(cell.x, cell.y)) {
    const otherRobotId = board.valueAt(cell.x, cell.y);
    return decreaseRobotHealth(game, otherRobotId, 100);
  }
  else {
    return game;
  }
}

export function idle(game, action) {
  return game;
}

function dispatch(game, action) {
  const fns = {
    [ActionTypes.MOVE]: move,
    [ActionTypes.ATTACK]: attack,
    [ActionTypes.IDLE]: idle
  };

  const actionFn = fns[action.action];

  if (actionFn) {
    return actionFn(game, action);
  }
  else {
      console.warn(`Unknown action "${action.action}"`);
      return game;
  };
}

export default {
  dispatch
};
