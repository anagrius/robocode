import * as engine from '../../src/engine/engine.js';

describe('Game', () => {
  describe('win condition', () => {
    it('is a draw, if no robots remain', () => {
      const robotCount = 0;
      const game = engine.createGame(2, robotCount);

      const gameState = engine.runOnce(game).getGameState();

      const winner = engine.winner(gameState);
      expect(winner).toEqual('DRAW');
    });

    it('is that the last robot remaining is the winner', () => {
      const robotCount = 1;
      const game = engine.createGame(2, robotCount);

      const gameState = engine.runOnce(game).getGameState();

      const robot0 = engine.getRobot(gameState, 0);
      const winner = engine.winner(gameState);
      expect(winner).toEqual(robot0.id);
    });

    it('is that there is no winner until there is only one robot left', () => {
      const robotCount = 2;
      const game = engine.createGame(2, robotCount);

      const gameState = engine.runOnce(game).getGameState();

      const winner = engine.winner(gameState);
      expect(winner).toEqual(null);
    });
  });
});
