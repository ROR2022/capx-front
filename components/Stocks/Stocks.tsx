"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";

import TableStocks from "./TableStocks";

import { DataUser, initialState, RootState, setUser } from "@/redux/userSlice";
import {
  getDataPortfolioByUser,
  updateStocksByUserId,
} from "@/api/apiPortfolio";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";

const Stocks = () => {
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [stocks, setStocks] = useState<Array<any> | null>(null);
  const [error, setError] = useState<string>("");
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("Stocks");
    if (!user.email || !user.access_token) {
      console.error("User not logged in");

      if (storedDataUser.email && !user.email) {
        dispatch(setUser(storedDataUser));
        if (storedDataUser.access_token) {
          getStocks(storedDataUser.access_token);
        }
      }
    } else {
      getStocks(user.access_token);
    }
  }, [user]);

  const getStocks = async (token: string) => {
    //console.log("getStocks", token);
    try {
      const response = await getDataPortfolioByUser(token);

      //console.log("response getDataPortfolioByUser: ", response);

      const { data, error } = response;

      if (data && !error) {
        //console.log("data: ", data);
        //const { stocks } = data;
        //console.log("stocks: ", data.stocks);

        if (data.stocks?.length > 0) {
          setStocks(data.stocks);
        } else {
          console.log("No stocks found");
          setError("No stocks found");
        }
      } else {
        console.log("error: ", error);
        setError("No data stocks");
      }
    } catch (error) {
      console.error("Error in handleSearch", error);
      setError("Error getting stocks");
    }
  };

  const editStocks = async (item: any) => {
    //console.log("Deleting Stock: ", item);
    if (!stocks || !user.access_token) return;
    try {
      const tempDataStocks = stocks?.filter((stock) => stock.id !== item.id);

      setStocks(tempDataStocks);
      const response = await updateStocksByUserId(
        user.access_token,
        tempDataStocks,
      );

      console.log("response updateStocksByUserId: ", response);
    } catch (error) {
      console.error("Error in editStocks", error);
    }
  };

  return (
    <div>
      {error && <p className="text-center text-danger mt-4">{error}</p>}
      {stocks && stocks.length > 0 && (
        <TableStocks data={stocks} editStocks={editStocks} />
      )}
    </div>
  );
};

export default Stocks;
