import { Card, CardBody } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";

interface MetricsProps {
  dataStocks: any[];
}

type TPortafolioDistribution = {
  symbol: string;
  percent: number;
};

interface IDataMetrics {
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  totalCost: number;
  totalCostPercent: number;
  totalQuantity: number;
  topPerformStock: string;
  portafolioDistribution: Array<TPortafolioDistribution>;
}

const Metrics: FC<MetricsProps> = ({ dataStocks }) => {
  const [dataMetrics, setDataMetrics] = useState<IDataMetrics | null>(null);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    //console.log('dataStocks: ', dataStocks)
    calcMetrics();
  }, [dataStocks]);

  useEffect(() => {
    //if (dataMetrics) console.log("dataMetrics: ", dataMetrics);
  }, [dataMetrics]);

  const calcMetrics = () => {
    if (dataStocks.length > 0) {
      //console.log('dataStocks: ', dataStocks)
      const totalValue: number = dataStocks.reduce(
        (acc, stock) => acc + stock.currentPrice * stock.quantity,
        0
      );
      const totalCost: number = dataStocks.reduce(
        (acc, stock) => acc + stock.c * stock.quantity,
        0
      );
      const totalGain: number = totalValue - totalCost;
      const totalGainPercent: number = (totalGain / totalCost) * 100;
      const totalQuantity: number = dataStocks.reduce(
        (acc, stock) => acc + Number(stock.quantity),
        0
      );
      const portafolioDistribution: Array<TPortafolioDistribution> =
        dataStocks.map((stock) => {
          return {
            symbol: stock.symbol,
            percent: Number(
              (
                ((stock.currentPrice * stock.quantity) / totalValue) *
                100
              ).toFixed(2)
            ),
          };
        });
      const topPerformStock: any = dataStocks.reduce((acc, stock) => {
        return acc.currentPrice * acc.quantity >
          stock.currentPrice * stock.quantity
          ? acc
          : stock;
      });

      setDataMetrics({
        totalValue: totalValue,
        totalGain: totalGain,
        totalGainPercent: totalGainPercent,
        totalCost: totalCost,
        totalCostPercent: (totalCost / totalValue) * 100,
        totalQuantity: totalQuantity,
        topPerformStock: topPerformStock.symbol,
        portafolioDistribution: portafolioDistribution,
      });
    }
  };

  return (
    <div
      className="mt-4 me-auto ms-auto"
      style={{ width: isMobile ? "100%" : "70%" }}
    >
      {dataMetrics && (
        <Card>
          <h3 className="text-lg font-semibold mt-2 ms-2">Metrics</h3>
          <CardBody className={isMobile ? "" : ""} style={{ width: "100%" }}>
            <Card>
              <CardBody>
                <h6>Total Value:</h6>
                <div
                  className={
                    isMobile ? "flex flex-col" : "flex justify-between"
                  }
                >
                  <p className="text-primary">
                    $ {dataMetrics.totalValue.toFixed(2)}
                  </p>
                  {dataMetrics.totalGain > 0 ? (
                    <FaAngleUp color="green" />
                  ) : (
                    <FaAngleDown color="red" />
                  )}
                  <p
                    className={
                      dataMetrics.totalGain > 0 ? "text-success" : "text-danger"
                    }
                  >
                    $ {dataMetrics.totalGain.toFixed(2)}
                  </p>
                  <p
                    className={
                      dataMetrics.totalGain > 0 ? "text-success" : "text-danger"
                    }
                  >
                    {dataMetrics.totalGainPercent.toFixed(2)} %
                  </p>
                </div>
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardBody>
                <h6>Top Perform Stock:</h6>
                <p className="text-primary">{dataMetrics.topPerformStock}</p>
              </CardBody>
            </Card>
            <Card className="mt-4">
              <CardBody>
                <h6>Portfolio Distribution:</h6>
                {dataMetrics.portafolioDistribution.map((item) => (
                  <Card key={item.symbol} className="mt-2">
                    <CardBody>
                      <p>
                        <span className="text-primary">{item.symbol}:</span> <span className="text-success">{item.percent} %</span>
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Metrics;
