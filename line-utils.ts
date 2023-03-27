import { width, dx, dy, height, minx, miny, maxx, maxy } from './constants';

export const idxToXY = (idx: number): [number, number] => {
  const cols = width / dx;
  return [idx % cols, Math.floor(idx / cols)];
};

export const xyToIdx = ([x, y]: [number, number]) => {
  const cols = width / dx;
  return y * cols + x;
};

export const xyToCart = ([x, y]: [number, number]): [number, number] => {
  return [(x + 0.5) * dx, (y + 0.5) * dy];
};

export const cartToXY = ([x, y]: [number, number]): [number, number] => {
  return [x / dx - 0.5, y / dy - 0.5];
};

export const cartToIdx = ([x, y]: [number, number]): number => {
  return xyToIdx(cartToXY([x, y]));
};

const getLinkDir = ([l1s, l1e]) => {
  const [diffx, diffy] = [l1e[0] - l1s[0], l1e[1], l1s[1]];
};

const pointIsOnLine = (p, [l1s, l1e]) => {
  const [[px, py], [x1, y1], [x2, y2]] = [p, l1s, l1e].map(idxToXY);

  if (x1 === x2) {
    // vertical
    return px === x1 && Math.min(y1, y2) <= py && py <= Math.max(y1, y2);
  } else if (y1 === y2) {
    // horizontal
    return py === y1 && Math.min(x1, x2) <= px && px <= Math.max(x1, x2);
  } else {
    const t1 = (px - x1) / (x2 - x1);
    const t2 = (py - y1) / (y2 - y1);
    return t1 === t2 && t1 <= 1 && 0 <= t1;
  }
};

const lineIdxIntersects = ([l1s, l1e], [l2s, l2e]) => {
  const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = [l1s, l1e, l2s, l2e].map(
    idxToXY
  );
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  // parallel or coincident
  if (denominator === 0) {
    return pointIsOnLine(l2s, [l1s, l1e]) || pointIsOnLine(l2e, [l1s, l1e]);
  }
  const px =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;
  const py =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;
  //console.log('intersection point is', px, py, denominator);
  return (
    Math.min(x1, x2) <= px &&
    Math.max(x1, x2) >= px &&
    Math.min(y1, y2) <= py &&
    Math.max(y1, y2) >= py &&
    Math.min(x3, x4) <= px &&
    Math.max(x3, x4) >= px &&
    Math.min(y3, y4) <= py &&
    Math.max(y3, y4) >= py
  );
};

const prettyPrint = ([l1s, l1e], [l2s, l2e]) => {
  return [l1s, l1e, l2s, l2e].map(idxToXY);
};

export const isParallel = ([l1s, l1e], [l2s, l2e]) => {
  const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = [l1s, l1e, l2s, l2e].map(
    idxToXY
  );
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  return denominator === 0;
};
const pDir = ['NW', 'NE', 'SE', 'SW', 'N', 'E', 'S', 'W'];

// if can insert
export const canInsert = (newLine, allLinks) => {
  for (const l of allLinks) {
    // This need to
    if (l[1] === newLine[0]) {
      //console.log('skipping for now');
      continue;
    }
    if (lineIdxIntersects(newLine, l)) {
      //console.log('interesect with');
      //console.log(prettyPrint(newLine, l));
      return false;
    }
  }
  return true;
};
