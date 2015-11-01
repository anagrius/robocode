import {List} from 'immutable';
import {sample} from 'lodash';
import {valueAt} from './board';

const Actions = {
  MOVE: "MOVE",
  CHARGE_SHIELD: "CHARGE_SHIELD",
  ATTACK: "ATTACK",
  IDLE: "IDLE"
};

const Directions = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN"
};

export function move(game, robotId, direction) {
  const {board} = game;
  const coords = board.positionOf(robotId);
  const {x, y} = coords;

  let newCoords = null;
  switch(direction) {
    case Directions.RIGHT:
      const currentValueRight = board.valueAt(x + 1, y);
      if (x !== game.boardSize - 1 && currentValueRight === null) {
        newCoords = {x: x + 1, y};
      }
      break;
    case Directions.LEFT:
      const currentValueLeft = board.valueAt(x - 1, y);
      if (x !== 0 && currentValueLeft === null) {
        newCoords = {x: x - 1, y};
      }
      break;
    case Directions.UP:
      const currentValueUp = board.valueAt(x, y - 1);
      if (y !== 0 && currentValueUp === null) {
        newCoords = {x, y: y - 1};
      }
      break;
    case Directions.DOWN:
      const currentValueDown = board.valueAt(x, y + 1);
      if (y !== game.boardSize - 1 && currentValueDown === null) {
        newCoods = {x, y: y + 1};
      }
      break;
    default:
      throw new Error(`Unknown direction '${direction}'`);
  }

  if (newCoords) {
    return game.update("board", b => b.place(null, x, y).place(robotId, newCoords.x, newCoords.y));
  }
  else {
    // If for instance we are on the left border and
    // try to move left. Nothing happens.
    return game;
  }
}

export function dispatch(game, action) {
  switch (action.action) {
    case Actions.MOVE:
      return move(game, action.robotId, action.direction);
    case Actions.IDLE:
      return game;
    default:
      throw new Error(`Unknown action "${action.action}"`);
      break;
  };
}

export default {
  dispatch
};
