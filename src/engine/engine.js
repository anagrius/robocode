import {times, reduce} from 'lodash';
import {createBoard} from './board';
import actions from './actions';
import {Record, List, fromJS, Map} from 'immutable';

var Actions = {
  MOVE: "MOVE",
  CHARGE_SHIELD: "CHARGE_SHIELD",
  ATTACK: "ATTACK",
  IDLE: "IDLE"
};

var Directions = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  UP: "UP",
  DOWN: "DOWN"
};

const nextId = 0;
function genId() {
  return nextId;
}

const Robot = Record({
  id: null,
  ai: require("raw!../programs/default.txt")
});

function createRobot(id = genId()) {
  return new Robot({id});
}

const Game = Record({
  robots: [],
  board: null,
  boardSize: 0
});

function createGame(boardSize, robotCount) {
  const robots = new Map(times(robotCount, createRobot).map(robot => [robot.id, robot]));
  let board = createBoard(boardSize, robotCount);

  switch (robotCount) {
    case 4:
      board = board.place(robots.get(3).id, 0, boardSize - 1);
    case 3:
      board = board.place(robots.get(2).id, boardSize - 1, 0);
    case 2:
      board = board.place(robots.get(1).id, boardSize - 1, boardSize - 1);
    case 1:
      board = board.place(robots.get(0).id, 0, 0);
      break;
    default:
      throw Error("invalid argument: 0 < robotCount <= 4");
      break;
  }

  return new Game({boardSize, robots, board});
}

function robotTurn(game, robot) {
  // TODO: Execute in a vm on the server.
  let robotAction = null;
  try {
    robotAction = eval(`(${robot.ai})()`);
    // TODO: Make a test that ensures you can't set the robotId in an AI script.
    robotAction.robotId = robot.id;
  }
  catch (e) {
    console.log("AI Failed: " + e.message);
    // If an AI fails.
    return game;
  }

  return actions.dispatch(game, robotAction);
}

const uiAction = (game, action) => action(game);

export function run(initialGame, onGameTick, getInput) {

  let game = initialGame;

  const gameLoop = () => {
    // User Input
    game = getInput().reduce(uiAction, game);
    // AI - TODO: Do round robin of which robot goes first.
    game = game.robots.valueSeq().reduce(robotTurn, game);
    // Output
    onGameTick(game);
  };

  const speed = 2;
  return setInterval(gameLoop, 1000 / speed);
};

export function stop(engineId) {
  clearInterval(engineId);
}

export default {
  run,
  stop,
  createGame
};
