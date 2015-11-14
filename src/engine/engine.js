import {times, reduce, partial} from 'lodash';
import {createBoard} from './boards';
import actions from './actions';
import {Record, List, fromJS, Map} from 'immutable';
import * as ai from './ai';

const nextId = 0;
function genId() {
  return nextId;
}

const Robot = Record({
  id: null,
  ai: 'function() { return AI.idle(); }',
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

export function createGame(boardSize, robotCount) {
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
    case 0:
      // For testing mainly. Simulate a Draw.
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
    const AI = ai.createAI(game.board, myRobotForPlayer, otherRobotsForPlayer);
    robotAction = eval(`(${robot.ai})`).call(null, myRobotForPlayer, otherRobotsForPlayer);
    // TODO: Make a test that ensures you can't set the robotId in an AI script.
    robotAction.robotId = robot.id;
  // }
  // catch (e) {
  //    console.warn("AI Failed: " + e.message);
  //    // If an AI fails, make the robot idle.
  //    return actions.dispatch(game, ai.idle());
  // }

  return actions.dispatch(game, robotAction);
}

const uiAction = (game, action) => action(game);

export function getRobot(gameState, idx) {
  return gameState.robots.get(idx);
}

/**
 * Runs one initial game tick, but does not start the run loop.
 * Mainly ment for testing.
 */
export function runOnce(initialGame, onGameTick = () => {}, getInput = () => []) {
  return run(initialGame, onGameTick, getInput, true);
}

export function run(initialGame, onGameTick = () => {}, getInput = () => [], once) {

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
    game = conditions.reduce((game, condition) => condition(game), game);
    // Output
    onGameTick(game);
  };

  // Make an initil game tick before scheduleing.
  gameLoop();

  const speed = 6;
  return {
    // For testing we allow just making an initial game tick.
    id: once ? null : setInterval(gameLoop, 1000 / speed),
    getGameState() {
      return game;
    }
  };
};

export function stop(gameHandle) {
  clearInterval(gameHandle.id);
}

export function winner(gameState) {
  const robotCount = gameState.robots.count();
  if (robotCount === 0) {
    return 'DRAW';
  }
  else if (robotCount === 1) {
    return gameState.robots.valueSeq().first().id;
  }
  else {
    return null;
  }
}

export default {
  run,
  stop,
  createGame
};
