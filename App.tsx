import * as React from 'react';
import './style.css';
import { maxx, height, width, dx, dy } from './constants';
import { Circles, LinePath, ShapePath, Squares, Triangles } from './shape-path';
import { chooseRandomElem, randomPathFnCreator, randomUniqArr } from './random';
import { cartToIdx, idxToXY, xyToCart } from './line-utils';
import { constellationDistances, groupDistances, shapesScore } from './scoring';
import { ShapeGrid } from './shape-grid';
import { ShapeStats } from './shape-stats';
import { ShapeView } from './shape-view';

export default function App() {
  const [a, sa] = React.useState(0);
  const [iterations, setIterations] = React.useState(50);

  const [maxStep, setMaxStep] = React.useState(20);
  const [shapeNum, setShapeNum] = React.useState(10);
  const [showPaths, setShowPath] = React.useState(false);

  const [shapePoints, links] = React.useMemo(() => {
    let counter = 0;
    let res;
    let maxResScore = -1;
    while (maxResScore < 1000) {
      const tempRes = randomUniqArr(
        shapeNum * 3,
        randomPathFnCreator({ maxStep })
      );
      const tempScore = shapesScore(tempRes[0]);
      if (tempScore > maxResScore) {
        maxResScore = tempScore;
        res = tempRes;
      }
    }
    return res;
  }, [a, shapeNum, maxStep, iterations]);

  const randomPoints = React.useMemo(() => {
    const points = { circle: [], square: [], triangle: [] };
    const keys = Object.keys(points);
    Array((width * height) / dx / dy)
      .fill(0)
      .forEach((_, i) => {
        if (Math.random() < 0.15) {
          points[chooseRandomElem(keys)].push(xyToCart(idxToXY(i)));
        }
      });
    return points;
  }, [a]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <ShapeView showPaths={showPaths} points={shapePoints} links={links} />
        <ShapeView showPaths={false} points={randomPoints} links={links} />
      </div>
      <div>
        <button onClick={() => sa(a + 1)}>Refresh</button>
      </div>
      <div>
        <button onClick={() => setShowPath(!showPaths)}>Toggle Paths</button>
      </div>
      <div>
        <label>
          Iterations = {iterations}
          <input
            value={iterations}
            onChange={(a) => setIterations(+a.target.value)}
            min="0"
            max={500}
            step="1"
            type="range"
          />
        </label>
      </div>

      <div>
        <label>
          ShapeNum = {shapeNum}
          <input
            value={shapeNum}
            onChange={(a) => setShapeNum(+a.target.value)}
            min="0"
            max="30"
            step="1"
            type="range"
          />
        </label>
      </div>
      <div>
        <label>
          Max Step = {maxStep}
          <input
            value={maxStep}
            onChange={(a) => setMaxStep(+a.target.value)}
            min="0"
            max={maxx}
            step="1"
            type="range"
          />
        </label>
      </div>
      <pre>
        {Buffer.from(
          [
            shapePoints.circle.map(cartToIdx).join('.'),
            shapePoints.square.map(cartToIdx).join('.'),
            shapePoints.triangle.map(cartToIdx).join('.'),
          ].join(':')
        ).toString('base64')}
      </pre>
    </div>
  );
}
