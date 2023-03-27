import * as React from 'react';
import { constellationDistances, groupDistances, shapesScore } from './scoring';

export const ShapeStats = ({ shapePoints }) => {
  return (
    <div>
      <ul>
        <li>
          <b>Shape Score</b>: {shapesScore(shapePoints)}
        </li>
        <li>
          <b># of Shapes</b>:{' '}
          {shapePoints.circle.length +
            shapePoints.square.length +
            shapePoints.triangle.length}
        </li>

        {Object.keys(shapePoints).flatMap((k) => (
          <React.Fragment>
            <li>
              {k} group distance: {groupDistances(shapePoints, k)}
            </li>
            <li>
              {k} constellation distance:{' '}
              {constellationDistances(shapePoints, k)}
            </li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};
