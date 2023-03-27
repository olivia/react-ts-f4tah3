const pointDistance = ([x1, y1], [x2, y2]) => {
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
};

const squaredPointDistance = ([x1, y1], [x2, y2]) => {
  return Math.pow(Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)), 2);
};
const pointDistances = (points, universe, measure) => {
  return points.map((p) =>
    Math.min(...universe.filter((a) => a !== p).map((u) => measure(p, u)))
  );
};

const avgArr = (a: number[]) => a.reduce((p, n) => p + n, 0) / a.length;

const powAvgArr = (a: number[]) =>
  Math.pow(
    a.reduce((p, n) => p * n, 1),
    1 / a.length
  );

export const groupDistances = (shapePoints, key) => {
  return powAvgArr(
    pointDistances(shapePoints[key], shapePoints[key], pointDistance)
  );
};
export const constellationDistances = (shapePoints, key) => {
  return avgArr(
    pointDistances(
      shapePoints[key],
      Object.keys(shapePoints)
        .filter((i) => i !== key)
        .map((k) => shapePoints[k])
        .flat(),
      pointDistance
    )
  );
};

export const shapesScore = (shapePoints) => {
  return Object.keys(shapePoints).reduce((p, n) => {
    const [groupDistance, constellationDistance] = [
      groupDistances,
      constellationDistances,
    ].map((fn) => fn(shapePoints, n));

    return (
      (p * Math.pow(groupDistance, 2)) / Math.pow(constellationDistance, 1.5)
    );
  }, 1);
};
