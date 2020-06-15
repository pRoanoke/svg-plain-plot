import React, { useState } from "react";
import Input from 'antd/lib/input';
import InputNumber from "antd/lib/input-number";
import Graph from "@components/Graph";
import rangeValidator from "@helpers/rangeValidator.js";
import 'antd/dist/antd.css';
import styles from './index.module.scss';
import WolframPlot from "../WolframPlot";
import Switch from "antd/lib/switch";

const { Search } = Input;

function Main() {
  const [expression, setExpression] = useState('x');
  const [xRange, setXRange] = useState([-5,5]);
  const [yRange, setYRange] = useState([-5,5]);
  const [step, setStep] = useState(1);
  const [selectedMethod, setMethod] = useState('svg');

  return (
    <div className={styles.app}>
      {selectedMethod === 'svg' && <Graph height={800} width={1600} expression={expression} step={step} xRange={xRange} yRange={yRange} />}
      {selectedMethod === 'wolfram' && <WolframPlot height={800} width={1600} expression={expression} xRange={xRange} yRange={yRange} />}
      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <Search style={{width: 400}}
                 addonBefore="y ="
                 placeholder="x"
                 enterButton="Execute"
                 onSearch={value => setExpression(value)}
          />
        </div>
        <div className={styles.controlsGroup}>
          Choose range for for X axis:
          <Input.Group compact>
            <InputNumber max={xRange[1]+1} value={xRange[0]} onChange={value => setXRange(xRange => {
              if (rangeValidator(value) || value >= xRange[1]) return xRange;
              xRange[0] = value;
              return [...xRange];
            })}
            />
            <InputNumber min={xRange[0]+1} value={xRange[1]} onChange={value => setXRange(xRange => {
              if (rangeValidator(value) || value <= xRange[0]) return xRange;
              xRange[1] = value;
              return [...xRange];
            })}
            />
          </Input.Group>
        </div>
        <div className={styles.controlsGroup}>
          Choose range for X axis:
          <Input.Group compact>
            <InputNumber max={yRange[1]+1} value={yRange[0]} onChange={value => setYRange(yRange => {
              if (rangeValidator(value) || value >= yRange[1]) return yRange;
              yRange[0] = value;
              return [...yRange];
            })}
            />
            <InputNumber min={yRange[0]+1} value={yRange[1]} onChange={value => setYRange(yRange => {
              if (rangeValidator(value) || value <= yRange[0]) return yRange;
              yRange[1] = value;
              return [...yRange];
            })}
            />
          </Input.Group>
        </div>
        <div className={styles.controlsGroup}>
            Choose step:
          <Input.Group compact>
            <InputNumber min={0.10} max={xRange.reduce((acc, value) => Math.abs(acc + value), 0)} step={0.1} value={step} onChange={value => value && setStep(value)} />
          </Input.Group>
        </div>
        <div className={styles.controlsGroup}>
          Use Wolfram API:
          <Input.Group compact>
            <Switch onChange={value => setMethod((value && 'wolfram') || 'svg')} />
          </Input.Group>
        </div>
      </div>
    </div>
  );
}

export default Main;
