import React, {useEffect, useState} from 'react';
import Spin from "antd/lib/spin";
import styles from './index.module.scss';
import Alert from "antd/lib/alert";


// It is better to use .env but I have to const this to show you the result
const appid = "V9P8A8-5PGWEQHT6J";
const corsProxy = "https://cors-anywhere.herokuapp.com/";

function WolframPlot({
                       height = 650,
                       width = 800,
                       expression = "x",
                       xRange = [-5, 5],
                       yRange = [-5, 5],
                       debounce = 0,
                     }) {
  const [plot, setPlot] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlot(null);
    async function parseExpression() {
      if (loading) return;

      setLoading(true);
      try {
        const response = await fetch(`${corsProxy}http://api.wolframalpha.com/v1/simple?appid=${appid}&input=plot ${expression} from x=${xRange[0]} to ${xRange[1]} y=${yRange[0]} to ${yRange[1]}`);
        if (!(response.headers.get('Content-Type') === 'image/gif')) return setError('Something went wrong, when we tried to fetch from Wolfram Alpha');
        const image = await response.blob();
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(image);
        fileReaderInstance.onload = () => {
          const base64data = fileReaderInstance.result;
          setPlot(base64data);
        };
        setLoading(false);
      } catch(err) {
        setError(err.message);
        setLoading(false);
      }
    }

    parseExpression();

  }, [expression, xRange, yRange, debounce]);

  return (
    <div className={styles.wrapper} style={{ minHeight: height }}>
      {loading && !error && <Spin/>}
      {error && (
        <Alert
          message="Error:"
          description={error}
          type="error"
        />
      )}
      {plot && !error && <img src={plot} />}
    </div>
  )
}

export default WolframPlot;
