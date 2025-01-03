"use client";
import {
  BarController,
  LinearScale,
  BarElement,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
import { ReactChart } from "chartjs-react";
import { FC, use, useEffect, useState } from "react";

import { IDataInfoStocks } from "./Dashboard";
//import { time } from "console";

// Register modules,
// this example for time scale and linear scale
ReactChart.register(BarController, LinearScale, BarElement, TimeScale, Tooltip);

//type timeseries = "time" | "timeseries";
//const myTimeSeries: timeseries = "time";

// options of chart similar to v2 with a few changes
// https://www.chartjs.org/docs/next/getting-started/v3-migration/
const chartOption = {
  scales: {
    x: {
      type: "time",
      adapters: {
        date: {
          locale: enUS,
        },
      },
    },
    y: {
      type: "linear",
    },
  },
};

interface BarChartProps {
  infoDataStocks: IDataInfoStocks;
}

const tempDataExample = {
  symbol: "BINANCE:BTCUSDT",
  labels: [
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
    "30/12/2024",
  ],
  data: [
    {
      x: 1735592499672,
      y: 94316.47,
    },
    {
      x: 1735592499744,
      y: 94316.46,
    },
    {
      x: 1735592500696,
      y: 94316.46,
    },
    {
      x: 1735592500696,
      y: 94316.46,
    },
    {
      x: 1735592500696,
      y: 94316.46,
    },
    {
      x: 1735592500696,
      y: 94316.46,
    },
    {
      x: 1735592500728,
      y: 94316.47,
    },
    {
      x: 1735592500004,
      y: 94316.47,
    },
    {
      x: 1735592500123,
      y: 94316.46,
    },
    {
      x: 1735592500168,
      y: 94316.46,
    },
    {
      x: 1735592500187,
      y: 94316.47,
    },
  ],
};

const BarChart: FC<BarChartProps> = ({ infoDataStocks }) => {
  const { labels, data, symbol } = tempDataExample;
  const [count, setCount] = useState(0);
  const tempLabels = labels.map((item) => {
    return item.replace(/\//g, "-");
  });

  useEffect(() => {
    console.log("tempLabels: ", tempLabels);
  }, []);

  useEffect(() => {
    if (count < 10 && infoDataStocks) {
      setCount((prev) => prev + 1);
      console.log("infoDataStocks: ", infoDataStocks);
    }
  }, [count]);
  //console.log("infoDataStocks: ", infoDataStocks);

  const chartData = {
    labels: [...tempLabels],
    datasets: [
      {
        label: symbol,
        data: [
          ...data.map((item) => {
            const tempDate = new Date(item.x).toISOString();
            //console.log("tempDate: ", tempDate);
            //const myDate = new Date(tempDate.getTime() + 1000 * 60 * 60 * 2).toISOString();
            const xTime = new Date(tempDate).getTime();

            console.log("xTime: ", xTime);

            return { x: new Date("30-12-2024").getTime(), y: item.y };
          }),
        ],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-4 px-4 py-4 shadow-lg rounded-lg">
      {/* <ReactChart
        data={chartData}
        height={400}
        options={chartOption}
        type="bar"
      /> */}
      BarChart
    </div>
  );
};

export default BarChart;

