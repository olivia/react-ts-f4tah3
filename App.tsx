import * as React from 'react';
import './style.css';
import { maxx, height, width, dx, dy } from './constants';
import { Circles, LinePath, ShapePath, Squares, Triangles } from './shape-path';
import { randomPathFnCreator, randomUniqArr } from './random';
import { cartToIdx } from './line-utils';

export default function App() {
  const [a, sa] = React.useState(0);
  const [maxStep, setMaxStep] = React.useState(20);
  const [shapeNum, setShapeNum] = React.useState(10);
  const [showPaths, setShowPath] = React.useState(false);

  const [shapePoints, links] = React.useMemo(() => {
    let iterations = 10;
    let res;
    while (iterations--) {
      res = randomUniqArr(shapeNum * 3, randomPathFnCreator({ maxStep }));

      if (res[0].length > shapeNum * 2) {
        return res;
      }
    }
    return res;
  }, [a, shapeNum, maxStep]);
  const hgrid = Array(height / dy)
    .fill(0)
    .map((_, i) => `M0 ${i * dy} L${width} ${i * dy}`)
    .join(' ');

  const vgrid = Array(width / dx)
    .fill(0)
    .map((_, i) => `M${i * dx} 0 L${i * dx} ${height}`)
    .join(' ');

  return (
    <div>
      <svg width={width} height={height} style={{ background: 'grey' }}>
        <path d={hgrid} stroke="white" />
        <path d={vgrid} stroke="white" />
        {showPaths && (
          <React.Fragment>
            <LinePath color={'red'} links={links.circle} />
            <LinePath color={'green'} links={links.square} />
            <LinePath color={'blue'} links={links.triangle} />
          </React.Fragment>
        )}
        <Circles points={shapePoints.circle} />
        <Triangles points={shapePoints.triangle} />
        <Squares points={shapePoints.square} />
      </svg>
      <div>
        <button onClick={() => sa(a + 1)}>Refresh</button>
      </div>
      <div>
        <button onClick={() => setShowPath(!showPaths)}>Toggle Paths</button>
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
