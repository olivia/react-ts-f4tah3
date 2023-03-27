import * as React from 'react';
import { ShapeGrid } from './shape-grid';
import { ShapeStats } from './shape-stats';

export const ShapeView = (props) => {
  const { showPaths, points, links } = props;
  return (
    <div>
      <ShapeGrid showPaths={showPaths} points={points} links={links} />
      <ShapeStats shapePoints={points} />
    </div>
  );
};
