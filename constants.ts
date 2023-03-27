export const [height, width, dx, dy] = [480, 800, 40, 40];
export const [minx, maxx, miny, maxy] = [0, width / dx, 0, height / dy];

export const DIRECTIONS = {
  SW: [-1, 1],
  SE: [1, 1],
  NE: [1, -1],
  NW: [-1, -1],
  S: [0, 1],
  E: [1, 0],
  N: [0, -1],
  W: [-1, 0],
};
export const DOFFSETS = [
  DIRECTIONS.SW,
  DIRECTIONS.SE,
  DIRECTIONS.NE,
  DIRECTIONS.NW,
];
export const COFFSETS = [
  DIRECTIONS.S,
  DIRECTIONS.E,
  DIRECTIONS.N,
  DIRECTIONS.W,
];

export const ALLOFFSETS = [...DOFFSETS, ...COFFSETS];
