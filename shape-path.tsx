import * as React from 'react';
import { dx, dy } from './constants';
export const ShapePath = (props) => {
  return (
    <polyline
      points={props.points.map((p) => `${p[0]},${p[1]}`).join(' ')}
      fill="none"
      stroke={props.color}
    />
  );
};

export const LinePath = (props) => {
  return props.links.map(([[x1, y1], [x2, y2]]) => (
    <line x1={x1} x2={x2} y1={y1} y2={y2} fill="none" stroke={props.color} />
  ));
};

export const Circles = ({ points }) => (
  <React.Fragment>
    {points.map(([x, y], i) => {
      return (
        <React.Fragment>
          <circle cx={x} cy={y} fill="red" r={dx / 3} />
          <text x={x} y={y} stroke="white">
            {i}
          </text>
        </React.Fragment>
      );
    })}
  </React.Fragment>
);
export const Squares = ({ points }) =>
  points.map(([x, y], i) => {
    return (
      <React.Fragment>
        <polygon
          points={`${-dx / 3 + x}, ${dy / 3 + y} ${-dx / 3 + x}, ${
            -dy / 3 + y
          } ${dx / 3 + x}, ${-dy / 3 + y} ${dx / 3 + x}, ${dy / 3 + y}`}
          fill="green"
        />
        <text x={x} y={y} stroke="white">
          {i}
        </text>
      </React.Fragment>
    );
  });
export const Triangles = ({ points }) =>
  points.map(([x, y], i) => {
    return (
      <React.Fragment>
        <polygon
          points={`${-dx / 3 + x}, ${dy / 3 + y} ${x}, ${-dy / 3 + y} ${
            dx / 3 + x
          }, ${dy / 3 + y}`}
          fill="blue"
          r={dx / 3}
        />{' '}
        <text x={x} y={y + 4} stroke="white">
          {i}
        </text>
      </React.Fragment>
    );
  });
