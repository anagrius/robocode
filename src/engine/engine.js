import {times, reduce, partial} from 'lodash';
import {createBoard} from './boards';
import actions from './actions';
import {Record, List, fromJS, Map} from 'immutable';
import * as AI from './ai';

const nextId = 0;
function genId() {
  return nextId;
}

const Robot = Record({
  id: null,
  ai: require("raw!../programs/default.txt"),
  health: 100
});

function createRobot(id = genId()) {
  return new Robot({id});
}

const GameStatus = {
  RUNNING: "RUNNING",
  FINISHED: "FINISHED"
};

const Game = Record({
  robots: [],
  board: null,
  boardSize: 0,
  status: GameStatus.RUNNING
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

function prepareRobotForPlayer(game, robot) {
  const pos = game.board.positionOf(robot.id);
  return {
    id: robot.id,
    x: pos.x,
    y: pos.y,
    health: robot.health
  };
}

function removeDeadRobots(game) {
  return game.robots.valueSeq().reduce((game, robot) => {
    if (robot.health > 0) {
      return game;
    }
    else {
      const pos = game.board.positionOf(robot.id);
      game = game.deleteIn(['robots', robot.id]);
      game = game.update('board', b => b.place(null, pos.x, pos.y));
      return game;
    }
  }, game);
}

function checkEndCondition(game) {
  console.log("GAME", game);
  // Could be ZERO or ONE robot left.
  return game.robots.count() >= 2 ?
    game :
    game.set('status', GameStatus.FINISHED);
}

function robotTurn(game, robot) {
  // TODO: Execute in a vm on the server.
  let robotAction = null;

  const myRobotForPlayer = prepareRobotForPlayer(game, robot);
  const otherRobotsForPlayer = game.robots.delete(robot.id).valueSeq().map(r => prepareRobotForPlayer(game, r)).toList();

  // try {
    robotAction = eval(`(${robot.ai})`).call(null, myRobotForPlayer, otherRobotsForPlayer);
    // TODO: Make a test that ensures you can't set the robotId in an AI script.
    robotAction.robotId = robot.id;
  // }
  // catch (e) {
  //   console.log("AI Failed: " + e.message);
  //   // If an AI fails.
  //   return game;
  // }

  return actions.dispatch(game, robotAction);
}

const uiAction = (game, action) => action(game);

export function run(initialGame, onGameTick, getInput) {

  let game = initialGame;

  const conditions = [
    removeDeadRobots,
    checkEndCondition
  ];

  const gameLoop = () => {
    // User Input
    game = getInput().reduce(uiAction, game);
    // AI - TODO: Do round robin of which robot goes first.
    game = game.robots.valueSeq().reduce(robotTurn, game);
    // Check Conditions
    console.log(game);
    game = conditions.reduce((game, condition) => condition(game), game);
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
