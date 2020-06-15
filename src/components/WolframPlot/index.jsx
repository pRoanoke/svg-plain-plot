import React, { useEffect, useState } from 'react';
import Spin from "antd/lib/spin";
import WolframAlphaAPI from 'wolfram-alpha-api';

// It is better to use .env but I have to const this to show you the result
const appid = "V9P8A8-5PGWEQHT6J";
const waApi = WolframAlphaAPI(appid);

function WolframPlot({
                       height = 650,
                       width = 800,
                       expression = "x",
                       xRange = [-5, 5],
                       yRange = [-5, 5],
                     }) {
  const [plot, setPlot] = useState(null);

  useEffect(() => {
    // Unfortunately it is impossible due to cors policy
    async function parseExpression() {
      const apiResult = await waApi.getFull(expression);
      console.log(apiResult);
    }

    parseExpression();
  }, [expression, xRange, yRange]);

  return (
    <div>
      {!plot && <Spin />}
    </div>
  )
}

export default WolframPlot;
