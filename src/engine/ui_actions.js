function updateRobotAI(robotId, aiCode) {
  return (game) => {
    return game.setIn(['robots', robotId, 'ai'], aiCode);
  }
}

export default {
  updateRobotAI
};
