"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import { CircularProgress } from "@nextui-org/react";

import CardStock from "../AddStocks/CardStock";

// eslint-disable-next-line import/order
import WebSocketClient, { MessageStock } from "./WebSocketClient";
//import BarChart from "./BarChart";

import Metrics from "./Metrics";

import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import { DataUser, initialState, RootState, setUser } from "@/redux/userSlice";
import { getDataDashboardByUser } from "@/api/apiPortfolio";

export interface IDataInfoStocks {
  symbol: string;
  labels: string[];
  data: Array<{ x: number; y: number }>;
}

const Dashboard = () => {
  //const isMobile = useMediaQuery("(max-width: 640px)");
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [dataStocks, setDataStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );
  const dispatch = useDispatch();
  const [messageStock, setMessageStock] = useState<MessageStock | null>(null);
  const [infoDataStocks, setInfoDataStocks] = useState<IDataInfoStocks | null>(
    null
  );

  useEffect(() => {
    //console.log("dataUser: ", user);
    if (user.access_token) {
      fetchDataPortfolio();
    }
  }, [user]);

  useEffect(() => {
    //console.log("storedDataUser: ", storedDataUser);
    if (storedDataUser.email && !user.email) {
      dispatch(setUser(storedDataUser));
    }
  }, [storedDataUser]);

  useEffect(() => {
    if (dataStocks.length > 0) {
      //console.log("dataStocks: ", dataStocks);
    }
  }, [dataStocks]);

  useEffect(() => {
    if (messageStock) {
      addInfoDataStocks();
      updateDataStocks();
    }
  }, [messageStock]);

  useEffect(() => {}, [infoDataStocks]);

  const updateDataStocks = () => {
    if (!messageStock) return;

    const isChanged = dataStocks.some((stock) => {
      //console.log("stock.symbol: ", stock.symbol);
      return stock.symbol === messageStock.data[messageStock.data.length - 1].s;
    });
    let messageStockDataDistinct: any[] = [];

    for (let i = messageStock.data.length - 1; i >= 0; i--) {
      if (
        !messageStockDataDistinct.some(
          (item) => item.s === messageStock.data[i].s
        )
      ) {
        messageStockDataDistinct.push(messageStock.data[i]);
      }
    }

    const tempDataStocks = dataStocks.map((stock) => {
      const foundSymbol = messageStockDataDistinct.find(
        (item) => item.s === stock.symbol
      );

      /* const foundBinance = messageStockDataDistinct.find(
        (item) => item.s === "BINANCE:BTCUSDT"
      ); */

      if (foundSymbol) {
        return {
          ...stock,
          c: foundSymbol.p,
          date: foundSymbol.t,
        };
      } else {
        return {
          ...stock,
          c: stock.c, //foundBinance ? foundBinance.p : stock.c,
          date: new Date().getTime(), //foundBinance ? foundBinance.t : new Date().getTime(),
        };
      }
    });

    if (isChanged === true) {
      console.log("isChanged: ");
      setDataStocks(tempDataStocks);
    }
  };

  const addInfoDataStocks = () => {
    if (!messageStock) return;
    const tempData = {
      symbol: messageStock.data[messageStock.data.length - 1].s,
      labels: messageStock.data.map((item) => {
        const myDate = new Date(item.t);

        return myDate.toLocaleDateString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      }),
      data: messageStock.data.map((item) => {
        return { x: item.t, y: item.p };
      }),
    };
    const tempInfoDataStocks: IDataInfoStocks = {
      symbol: infoDataStocks ? infoDataStocks.symbol : tempData.symbol,
      labels: infoDataStocks
        ? [...infoDataStocks.labels, ...tempData.labels]
        : tempData.labels,
      data: infoDataStocks
        ? [...infoDataStocks.data, ...tempData.data]
        : tempData.data,
    };

    setInfoDataStocks(tempInfoDataStocks);
  };

  const fetchDataPortfolio = async () => {
    if (!user.access_token) return;
    try {
      setLoading(true);
      const response = await getDataDashboardByUser(user.access_token);

      //console.log("dataDashboard response: ", response);
      const { data, error } = response;

      if (data && !error) {
        const { stocks, dataPrice, error, message } = data;

        if (error) {
          console.error("Error in fetchDataPortfolio: ", error);
          setLoading(false);
          setErrorMessage(`${error} - ${message}, please try login again.`);

          return;
        }

        //console.log("stocks: ", stocks);
        //console.log("dataPrice: ", dataPrice);

        if (stocks) {
          const tempStocks = stocks.map((stock: any) => {
            const findDataPrice = dataPrice.find(
              (item: any) => item.symbol === stock.symbol
            );

            return {
              ...stock,
              isDashboard: true,
              date: new Date().getTime(),
              currentPrice: findDataPrice ? findDataPrice.c : stock.c,
              quantity: stock.quantity ? stock.quantity : 1,
            };
          });

          setDataStocks(tempStocks.reverse());
        }
      }

      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
      setLoading(false);
    }
  };

  const formatMyDate = (date: number) => {
    const myDate = new Date(date);

    //myDate.setHours(myDate.getHours() - 6);

    return myDate.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div>
      <WebSocketClient
        dataStocks={dataStocks}
        setMessageStock={setMessageStock}
      />
      <h2 className="text-center text-3xl my-4 font-bold">Dashboard</h2>
      {messageStock && (
        <div>
          <p className="text-gray-500 text-xs text-center">
            WebSocket connected.
          </p>
          <div className="hidden">
            <p>Symbol: {messageStock.data[messageStock.data.length - 1].s}</p>
            <p>Price: {messageStock.data[messageStock.data.length - 1].p}</p>
            <p>
              Date:{" "}
              {formatMyDate(messageStock.data[messageStock.data.length - 1].t)}
            </p>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center mt-4">
          <CircularProgress aria-label="loading..." size="lg" />
        </div>
      )}
      {errorMessage && (
        <p className="text-red-500 text-center text-xs">{errorMessage}</p>
      )}
      {dataStocks.length > 0 && <Metrics dataStocks={dataStocks} />}
      {dataStocks.length > 0 && (
        <div>
          <h2 className="text-center text-3xl my-4 font-bold">
            Stocks Details
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {dataStocks.map((stock) => (
              <CardStock key={stock.id} dataCard={stock} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
