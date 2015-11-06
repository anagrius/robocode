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
    case Directions.
    default:
      throw Error(`unknown direction ${direction}`);
      break;
  }
}
