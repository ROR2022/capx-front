"use client";
import React, { useEffect, FC, useState, Suspense } from "react";
//import { useLocalStorage } from "usehooks-ts";
//import { io, Socket } from "socket.io-client";

import { FINNHUB_APIKEY } from "@/dataEnv/dataEnv";

export type InfoStock = {
  c: any;
  p: number;
  s: string;
  t: number;
  v: number;
};

export type MessageStock = {
  data: Array<InfoStock>;
  type: string;
};

interface WebSocketClientProps {
  dataStocks: any[];
  setMessageStock: (messageStock: MessageStock) => void;
}

interface GetSocketProps {
  setMySocket: (socket: WebSocket) => void;
}

const GetSocket: FC<GetSocketProps> = ({ setMySocket }) => {
  //let socket: WebSocket | null = null;
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    connSocket()
      .then((socket) => {
        setMySocket(socket as WebSocket);
        setSocket(socket as WebSocket);
      })
      .catch((error) => {
        console.log("Error Connecting WebSocket: ", error);
        setError("Error Connecting WebSocket");
        setTimeout(() => {
          setError(null);
        }, 5000);
      });
  }, []);

  useEffect(() => {}, [socket]);

  useEffect(() => {}, [error]);

  const connSocket = async () => {
    return new Promise((resolve, reject) => {
      const socket: WebSocket = new WebSocket(
        `wss://ws.finnhub.io?token=${FINNHUB_APIKEY}`
      );

      socket.onopen = () => resolve(socket);
      socket.onerror = (error) => reject(error);
    });
  };

  if (error) {
    return <p className="text-gay-500 text-center text-xs">{error}</p>;
  } else {
    return <div className="hidden">GetSocket</div>;
  }

  //return <div className="hidden">GetSocket</div>;
};

const WebSocketClient: FC<WebSocketClientProps> = ({
  dataStocks,
  setMessageStock,
}) => {
  const [mySocket, setMySocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      // Unsubscribe
      //mySocket.send(JSON.stringify({ type: "unsubscribe", symbol: "AAPL" }));
      //mySocket.close();
      if (!mySocket) {
        return;
      }
      unsubscribe("BINANCE:BTCUSDT");
      dataStocks.forEach((stock) => {
        unsubscribe(stock.symbol);
      });
      mySocket.close();
      if (mySocket) {
        setMySocket(null);
      }
    };
  }, []);

  useEffect(() => {
    if (dataStocks.length > 0) {
      //console.log("websocket dataStocks: ", dataStocks);
    }

    if (!mySocket) {
      //console.log("No socket ", mySocket);

      return;
    }

    mySocket.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
    );

    dataStocks.forEach((stock) => {
      mySocket.send(
        JSON.stringify({ type: "subscribe", symbol: stock.symbol })
      );
    });

    // Listen for messages
    mySocket.addEventListener("message", function (event: any) {
      //console.log("Message from server ", event.data);
      const { data, type } = JSON.parse(event.data);

      if (type === "trade") {
        setMessageStock({ data, type });
      }
    });
  }, [mySocket]);

  const unsubscribe = function (symbol: string) {
    if (!mySocket) {
      return;
    }
    mySocket.send(JSON.stringify({ type: "unsubscribe", symbol: symbol }));
  };

  return (
    <div className="hidden">
      <Suspense fallback={<div>Loading...</div>}>
        <GetSocket setMySocket={setMySocket} />
      </Suspense>
      WebSocketClient
    </div>
  );
};

export default WebSocketClient;
