import * as React from 'react';
import { dx, dy, height, width } from './constants';
import { Circles, LinePath, Squares, Triangles } from './shape-path';

type Point = [number, number];

export const ShapeGrid: React.FC<{
  showPaths: boolean;
  points: { circle: Point[]; square: Point[]; triangle: Point[] };
  links: {
    circle: [Point, Point][];
    square: [Point, Point][];
    triangle: [Point, Point][];
  };
}> = (props) => {
  const { links, points } = props;
  const hgrid = Array(height / dy)
    .fill(0)
    .map((_, i) => `M0 ${i * dy} L${width} ${i * dy}`)
    .join(' ');

  const vgrid = Array(width / dx)
    .fill(0)
    .map((_, i) => `M${i * dx} 0 L${i * dx} ${height}`)
    .join(' ');
  return (
    <svg width={width} height={height} style={{ background: 'grey' }}>
      <path d={hgrid} stroke="white" />
      <path d={vgrid} stroke="white" />
      {props.showPaths && (
        <React.Fragment>
          <LinePath color={'red'} links={links.circle} />
          <LinePath color={'green'} links={links.square} />
          <LinePath color={'blue'} links={links.triangle} />
        </React.Fragment>
      )}
      <Circles points={points.circle} />
      <Triangles points={points.triangle} />
      <Squares points={points.square} />
    </svg>
  );
};
