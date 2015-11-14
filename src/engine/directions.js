const Directions = {
  NORTH: "NORTH",
  NORTH_EAST: "NORTH_EAST",
  EAST: "EAST",
  SOUTH_EAST: "SOUTH_EAST",
  SOUTH: "SOUTH",
  SOUTH_WEST: "SOUTH_WEST",
  WEST: "WEST",
  NORTH_WEST: "NORTH_WEST"
};

export default Directions;

export function reverseDirection(direction) {
  switch (direction) {
    case Directions.NORTH:
      return Directions.SOUTH;
    case Directions.SOUTH:
      return Directions.NORTH;
    case Directions.NORTH_EAST:
      return Directions.SOUTH_WEST;
    case Directions.SOUTH_WEST:
      return Directions.NORTH_EAST;
    case Directions.NORTH_WEST:
      return Directions.SOUTH_EAST;
    case Directions.SOUTH_EAST:
      return Directions.NORTH_WEST;
    case Directions.EAST:
      return Directions.WEST;
    case Directions.WEST:
      return Directions.EAST;
    default:
      throw Error(`unknown direction ${direction}`);
      break;
  }
}

export function nextDirectionClockwise(direction) {
  switch (direction) {
    case Directions.NORTH:
      return Directions.NORTH_EAST;
    case Directions.SOUTH:
      return Directions.SOUTH_WEST;
    case Directions.NORTH_EAST:
      return Directions.EAST;
    case Directions.SOUTH_WEST:
      return Directions.WEST;
    case Directions.NORTH_WEST:
      return Directions.NORTH;
    case Directions.SOUTH_EAST:
      return Directions.SOUTH;
    case Directions.EAST:
      return Directions.SOUTH_EAST;
    case Directions.WEST:
      return Directions.NORTH_WEST;
    default:
      throw Error(`unknown direction ${direction}`);
      break;
  }
}

export function nextDirectionCounterClockwise(direction) {
  switch (direction) {
    case Directions.NORTH:
      return Directions.NORTH_WEST;
    case Directions.SOUTH:
      return Directions.SOUTH_EAST;
    case Directions.NORTH_EAST:
      return Directions.NORTH;
    case Directions.SOUTH_WEST:
      return Directions.SOUTH;
    case Directions.NORTH_WEST:
      return Directions.WEST;
    case Directions.SOUTH_EAST:
      return Directions.EAST;
    case Directions.EAST:
      return Directions.NORTH_EAST;
    case Directions.WEST:
      return Directions.SOUTH_WEST;
    default:
      throw Error(`unknown direction ${direction}`);
      break;
  }
}
