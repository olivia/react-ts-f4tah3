import {
  height,
  width,
  dx,
  dy,
  maxx,
  maxy,
  minx,
  miny,
  ALLOFFSETS,
  DOFFSETS,
} from './constants';
import { canInsert, idxToXY, xyToCart, xyToIdx } from './line-utils';

const randIdx = () =>
  Math.round(Math.random() * (-1 + (height * width) / (dx * dy)));

const pointsIdxToCart = (point) => {
  return xyToCart(idxToXY(point));
};

const linksIdxToCart = (link) => {
  return [xyToCart(idxToXY(link[0])), xyToCart(idxToXY(link[1]))];
};
const shapeLinksToCart = (shapeLinks) => {
  return Object.keys(shapeLinks).reduce((p, n) => {
    return { ...p, [n]: shapeLinks[n].map(linksIdxToCart) };
  }, {});
};

const shapePointsToCart = (shapePoints) => {
  return Object.keys(shapePoints).reduce((p, n) => {
    return { ...p, [n]: shapePoints[n].map(pointsIdxToCart) };
  }, {});
};

export const randomUniqArr = (n, randGen) => {
  let maxiters = 100;
  let [allLinks, allPoints] = [[], []];

  const shapePoints = { circle: [], triangle: [], square: [] };
  const shapeLinks = { circle: [], triangle: [], square: [] };
  const shapeKeys = Object.keys(shapePoints);
  let i = 0;
  while (i < n && maxiters >= 0) {
    const shapeKey = shapeKeys[i % 3];
    const links = shapeLinks[shapeKey];
    const points = shapePoints[shapeKey];
    try {
      const newLine = randGen(points, links, allPoints, allLinks);
      points.push(newLine[1]);
      allPoints.push(newLine[1]);
      i++;

      if (newLine[0] !== undefined) {
        allLinks.push(newLine);
        links.push(newLine);
      }
    } catch (e) {
      console.log('BALBALBLA', e);
      const poppedPoint = points.pop();
      allPoints = allPoints.filter((a) => a !== poppedPoint);
      if (points.length > 0) {
        const poppedLink = links.pop();
        allLinks = allLinks.filter((a) => a !== poppedLink);
      }
      n++;

      maxiters--;
    }
  }
  if (maxiters < 0) {
    console.log('exhausted rand function');
  }
  console.log(shapePoints);
  return [shapePointsToCart(shapePoints), shapeLinksToCart(shapeLinks)];
};

const offsetPivotPoint = (pivotPoint, dir, magnitude) => {
  const oldXY = idxToXY(pivotPoint);
  const offset = [dir[0] * magnitude, dir[1] * magnitude];
  let newXY = [
    Math.min(maxx - 1, Math.max(minx, oldXY[0] + offset[0])),
    Math.min(maxy - 1, Math.max(miny, oldXY[1] + offset[1])),
  ];

  if (DOFFSETS.indexOf(dir) >= 0) {
    const maxMagnitude = Math.min(
      Math.abs(newXY[0] - oldXY[0]),
      Math.abs(newXY[1] - oldXY[1])
    );
    newXY = [
      oldXY[0] + (maxMagnitude * offset[0]) / Math.abs(offset[0]),
      oldXY[1] + (maxMagnitude * offset[1]) / Math.abs(offset[1]),
    ];
  }
  return xyToIdx(newXY as [number, number]);
};

const chooseOffset = (skipList) => {
  const nonskippedOffset = ALLOFFSETS.filter(
    (_, i) => skipList.indexOf(i) === -1
  );

  return nonskippedOffset[
    Math.round(Math.random() * (nonskippedOffset.length - 1))
  ];
};

export const randomWalk = ({
  pivotPoint,
  magnitude,
  skipList = [],
  offset,
}) => {
  const perturbedPoint = offsetPivotPoint(pivotPoint, offset, magnitude);
  return [ALLOFFSETS.indexOf(offset), [pivotPoint, perturbedPoint]] as const;
};

export const randomPathFnCreator = ({ maxStep }) => {
  const fn = (points, links, allPoints, allLinks) => {
    let iterations = 0;
    let skipList = [];
    let pivotPointOffset = 0;
    let pivotPoint = points[points.length - 1];

    while (iterations <= 100) {
      if (points.length === 0) {
        const r = randIdx();
        if (allPoints.indexOf(r) >= 0) {
          continue;
        }
        console.log('returned first');
        return [undefined, r];
      } else {
        let offsetAttempt, newLine;
        let magnitude = maxStep;
        const offset = chooseOffset(skipList);
        while (magnitude > 0) {
          [offsetAttempt, newLine] = randomWalk({
            pivotPoint,
            magnitude,
            skipList,
            offset,
          });

          if (
            allPoints.indexOf(newLine[1]) == -1 &&
            canInsert(newLine, allLinks)
          ) {
            console.log('returned newline', newLine[1]);
            return [pivotPoint, newLine[1]];
          } else {
            magnitude = Math.floor(magnitude - 2);
          }
        }

        if (skipList.length === 7) {
          if (points.length - 1 <= pivotPointOffset) {
            throw new Error('Tried everything: ' + pivotPointOffset);
          }
          skipList = [];
          pivotPointOffset++;
          pivotPoint = points[points.length - 1 - pivotPointOffset];
        } else {
          skipList.push(offsetAttempt);
        }

        iterations++;
      }
    }
    throw new Error('Exhausted iterations');
  };
  return fn;
};
