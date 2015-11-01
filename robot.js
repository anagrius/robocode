
function act({robot, otherRobots}) {
  return {
    action: Actions.MOVE,
    direction: Directions.LEFT,
  };
}

module.exports = {
  act
};
