import React, { useCallback, useEffect, useState } from "react";
import notification from "antd/lib/notification";
import parseExpression from "@helpers/parseExpression";
import styles from "./index.module.scss"

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
  const strokesCountX = Math.abs(xRange[0]-xRange[1]);
  const strokesCountY = Math.abs(yRange[0]-yRange[1]);
  const xStrokes = new Array(strokesCountX).fill('');
  const yStrokes = new Array(strokesCountY).fill('');
  /* Making work with ranges more friendly (adjust plot) */
  const xStep = xRange.reduce((acc, value) => acc + value, 0);
  const offsetX = (width / strokesCountX) * xStep;
  const yStep = yRange.reduce((acc, value) => acc + value, 0);
  const offsetY = (height / strokesCountY) * yStep;

  const [chartValues, setChartValues] = useState(null);

  /* potential animation */
  const path = useCallback(path => {
    if (path !== null) {
      path.classList.remove('animated');
      setTimeout(() => {
        const length = path.getTotalLength();
        void path.offsetHeight;
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = length;
        path.classList.add('animated');
      }, 0)

    }
  }, [expression, step, yRange, xRange]);

  useEffect(() => {
    try {
      const resultCoordinates = [];

      for (let x = xRange[0]; x <= xRange[1]; x += step) {
        const y = parseExpression(expression, x);
        if (typeof y === "object") {
          handleError(y);
          break;
        }
        if (typeof y !== "number" || y === Infinity) continue;
        if(y > Math.max.apply(null, yRange)) continue;
        resultCoordinates.push([x, y])
      }

      setChartValues(resultCoordinates);
    } catch (err) {
      handleError(err);
    }
  }, [expression, xRange, yRange, step]);

  const handleError = error =>  notification.error({message: error.message });

  // Todo: Make complexity to be < O[2]
  const drawChart = (arrayOfValues) => {
    let xCoordinateStep = x0 + (width / strokesCountX);
    let yCoordinateStep = y0 + (height / strokesCountY);

    return (
      <g>
        <path
          ref={path}
          d={
            `M ${(width - offsetX) / 2 + xCoordinateStep * arrayOfValues[0][0]}, ${(height + offsetY) / 2 - yCoordinateStep * arrayOfValues[0][1]}
            ${arrayOfValues.map(([x, y], index, array) => {
                if (array[index + 1]) {
                  return `L ${(width - offsetX) / 2 + xCoordinateStep * array[index + 1][0]}, ${(height + offsetY) / 2 - yCoordinateStep * array[index + 1][1]}`
                }
                return '';
              }
            )}`
          }
          className={`${styles.chartLine}`}
        />
        {arrayOfValues.map(([x, y]) => (
          <circle
            key={Math.random()}
            cx={(width - offsetX) / 2 + xCoordinateStep * x}
            cy={(height + offsetY) / 2 - yCoordinateStep * y}
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
              <line x1={x0 + strokeStep} y1={(height + offsetY) / 2 - 5} x2={x0 + strokeStep} y2={(height + offsetY) / 2 + 5}
                    stroke="#111"/>
              <text x={x0 + strokeStep + 5} y={(height + offsetY) / 2 - 5} className={styles.strokeValue}>
                {(index < strokesCount / 2 && -((strokesCount - xStep) / 2 - index)) || -((strokesCount - xStep) / 2) + index}
              </text>
            </g>
          )
        })}
        {yStrokes.map((item, index, {length: strokesCount}) => {
          let strokeStep = y0 + ((strokesCount - index) * height / strokesCountY);
          return (
            <g key={strokeStep + index}>
              <line x1={x0} y1={y0 + strokeStep} x2={width} y2={y0 + strokeStep} stroke="#ddd"
                    className={styles.chartGrid}/>
              <line x1={(width - offsetX) / 2 + 5} y1={y0 + strokeStep} x2={(width - offsetX) / 2 - 5} y2={y0 + strokeStep}
                    stroke="#111"/>
              <text x={(width - offsetX) / 2 + 5} y={y0 + strokeStep - 5} className={styles.strokeValue}>
                {(index < strokesCount / 2 && -((strokesCount - yStep) / 2 - index)) || -((strokesCount - yStep) / 2) + index}
              </text>
            </g>
          )
        })}
      </g>
      {/* X axis */}
      <g>
        <line
          x1={x0}
          y1={(height + offsetY) / 2}
          x2={x0 + width}
          y2={(height + offsetY) / 2}
          stroke="grey"
        />
        <path d={`M ${width}, ${(height + offsetY) / 2}
                  L ${width - 10}, ${(height + offsetY) / 2 - 3}
                  L ${width - 10}, ${(height + offsetY) / 2 + 3}`}
              stroke="grey"
        />
        <text x={width - 10} y={(height + offsetY) / 2 - 5}>
          x
        </text>
      </g>

      {/* Y axis */}
      <line x1={(width - offsetX) / 2} y1={y0} x2={(width - offsetX)  / 2} y2={y0 + height} stroke="grey"/>
      <text x={(width - offsetX) / 2 - 10} y={y0 + 10} textAnchor="middle">
        y
      </text>
      <path d={`M ${(width - offsetX) / 2}, ${y0}
                  L ${(width - offsetX) / 2 - 3}, ${y0 + 10}
                  L ${(width - offsetX) / 2 + 3}, ${y0 + 10}`}
            stroke="grey"
      />
      {chartValues && !!chartValues.length && drawChart(chartValues)}
    </svg>
  );
}

export default React.memo(Graph);
