import React, { useCallback, useEffect, useState } from "react";
import styles from "./graph.module.scss"
import notification from "antd/lib/notification";

function Graph({
                 height = 650,
                 width = 800,
                 expression = 'x',
                 xRange = [-5, 5],
                 yRange = [-5, 5],
                 step = 1
               }) {

  const x0 = 0;
  const y0 = 0;
  /* Create iterable array for strokes */
  const strokesCountX = xRange.reduce((acc, value) => Math.abs(acc + value), 0);
  const strokesCountY = yRange.reduce((acc, value) => Math.abs(acc + value), 0);
  const xStrokes = new Array(strokesCountX).fill('');
  const yStrokes = new Array(strokesCountY).fill('');

  const [chartValues, setChartValues] = useState(null);

  useEffect(() => {
    try {
      const parsedExpression = parseExpression(expression);
      /* Eval is unsafe, so let's test if we really have an expression to proceed */
      if (/[^x\d*/+-]/.test(parsedExpression)) return notification.error({message: 'Forbidden characters'});
      const resultCoordinates = [];

      for (let x = xRange[0]; x <= xRange[1]; x += step) {
        /* No dividing by zero */
        if (/.+\/[a-zA-Z]/.test(expression) && x === 0) continue;
        const y = eval(parsedExpression);
        if (typeof y !== "number") throw new Error();
        resultCoordinates.push([x, y])
      }

      setChartValues(resultCoordinates);
    } catch (err) {
    notification.error({
      message: 'Please, check your expression'
    });
    return;
  }
  }, [expression, xRange, step]);

  // Todo: Make complexity to be < O[2]
  const drawChart = (arrayOfValues) => {
    let xCoordinateStep = x0 + (width / strokesCountX);
    let yCoordinateStep = y0 + (height / strokesCountY);

    return (
      <g>
        <path
          d={
            `M ${width / 2 + xCoordinateStep * arrayOfValues[0][0]}, ${height / 2 - yCoordinateStep * arrayOfValues[0][1]}
            ${arrayOfValues.map(([x, y], index, array) => {
                if (array[index + 1]) {
                  return `L ${width / 2 + xCoordinateStep * array[index + 1][0]}, ${height / 2 - yCoordinateStep * array[index + 1][1]}`
                }
                return '';
              }
            )}`
          }
          className={styles.chartLine}
        />
        {arrayOfValues.map(([x, y], index) => (
          <circle
            key={Math.random()}
            cx={width / 2 + xCoordinateStep * x}
            cy={height / 2 - yCoordinateStep * y}
            r={3}
            className={styles.chartDot}
          />
        ))}
      </g>
    )
  };

  return (
    <svg className={styles.chart} width={width} height={height}>
      {/* Grid */}
      <g>
        {xStrokes.map((item, index, {length: strokesCount}) => {
          let strokeStep = x0 + (index * width / strokesCountX);
          return (
            <g key={strokeStep + index}>
              <line x1={x0 + strokeStep} y1={y0} x2={x0 + strokeStep} y2={height} stroke="#ddd"
                    className={styles.chartGrid}/>
              <line x1={x0 + strokeStep} y1={(height / 2) - 5} x2={x0 + strokeStep} y2={(height / 2) + 5}
                    stroke="#111"/>
              <text x={x0 + strokeStep + 5} y={(height / 2) - 5} className={styles.strokeValue}>
                {(index < strokesCount / 2 && `-${strokesCount / 2 - index}`) || `${-((strokesCount / 2) - index)}`}
              </text>
            </g>
          )
        })}
        {yStrokes.map((item, index, {length: strokesCount}) => {
          let strokeStep = y0 + (index * height / strokesCountY);
          return (
            <g key={strokeStep + index}>
              <line x1={x0} y1={y0 + strokeStep} x2={width} y2={y0 + strokeStep} stroke="#ddd"
                    className={styles.chartGrid}/>
              <line x1={width / 2 + 5} y1={y0 + strokeStep} x2={width / 2 - 5} y2={y0 + strokeStep}
                    stroke="#111"/>
              <text x={width / 2 + 5} y={y0 + strokeStep - 5} className={styles.strokeValue}>
                {(index < strokesCount / 2 && `${strokesCount / 2 - index}`) || `${(strokesCount / 2) - index}`}
              </text>
            </g>
          )
        })}
      </g>
      {/* X axis */}
      <g>
        <line
          x1={x0}
          y1={height / 2}
          x2={x0 + width}
          y2={height / 2}
          stroke="grey"
        />
        <path d={`M ${width}, ${height / 2}
                  L ${width - 10}, ${height / 2 - 3}
                  L ${width - 10}, ${height / 2 + 3}`}
              stroke="grey"
        />
        <text x={width - 10} y={height / 2 - 5}>
          x
        </text>
      </g>

      {/* Y axis */}
      <line x1={width / 2} y1={y0} x2={width / 2} y2={y0 + height} stroke="grey"/>
      <text x={width / 2 - 10} y={y0 + 10} textAnchor="middle">
        y
      </text>
      <path d={`M ${width / 2}, ${y0}
                  L ${width / 2 - 3}, ${y0 + 10}
                  L ${width / 2 + 3}, ${y0 + 10}`}
            stroke="grey"
      />
      {chartValues && drawChart(chartValues)}
    </svg>
  );
}

export default Graph;
