"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";

import FormEditPortfolio from "./FormEditPortfolio";

import { DataUser, initialState, RootState, setUser } from "@/redux/userSlice";
import { LOCALSTORAGE_KEY } from "@/dataEnv/dataEnv";
import {
  getDataPortfolioByUser,
  updateStocksByUserId,
} from "@/api/apiPortfolio";

interface GetParamIdProps {
  setParamId: (id: string) => void;
}

const GetParamId: FC<GetParamIdProps> = ({ setParamId }) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setParamId(id || "");
  }, [id]);

  return <div className="hidden">GetParamId</div>;
};

const EditStock = () => {
  const router = useRouter();
  const [paramId, setParamId] = useState<string>("");
  const [dataStocks, setDataStocks] = useState<any[]>([]);
  //const [error, setError] = useState<string>("");
  const [editingStock, setEditingStock] = useState<any | null>(null);
  const user: DataUser = useSelector((state: RootState) => state.user);
  const [storedDataUser] = useLocalStorage<DataUser>(
    LOCALSTORAGE_KEY,
    initialState
  );
  const dispatch = useDispatch();

  useEffect(() => {
    //console.log("dataUser: ", user);
    if (user.email && user.access_token && dataStocks.length === 0) {
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
    //console.log("paramId: ", paramId);
    if (paramId && dataStocks.length > 0 && !editingStock) {
      const stock = dataStocks.find((stock) => stock.id === paramId);
      //console.log("stock: ", stock);

      //setEditingStock(stock);
      parseEditStock(stock);
    }
  }, [paramId]);

  useEffect(() => {
    if (paramId && dataStocks.length > 0 && !editingStock) {
      const stock = dataStocks.find((stock) => stock.id === paramId);
      //console.log("stock: ", stock);

      //setEditingStock(stock);
      parseEditStock(stock);
    }
  }, [dataStocks]);

  const fetchDataPortfolio = async () => {
    if (!user?.access_token) return;
    try {
      const response = await getDataPortfolioByUser(user.access_token);

      //console.log("getDataPortfolioByUser response: ", response);

      const { data, error } = response;

      if (data && !error) {
        setDataStocks(data.stocks);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleEditPortfolio = async (tempDataStock: any) => {
    try {
      const tempDataStocks = dataStocks.map((stock) => {
        if (stock.id === tempDataStock.id) {
          const { name, ticker, symbol, quantity, buyPrice, currency } =
            tempDataStock;
          const tempStock = {
            ...stock,
            name,
            ticker,
            symbol,
            quantity,
            c: buyPrice,
            currency,
          };

          return tempStock;
        }

        return stock;
      });
      const response = await updateStocksByUserId(
        user.access_token,
        tempDataStocks
      );

      console.log("updateStocksByUserId response: ", response);

      if (response.data && !response.error) {
        router.push("/stocks");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const parseEditStock = (item: any) => {
    if (!item) return;
    const { id, name, ticker, symbol, quantity, c, currency } = item;
    const tempStock = {
      id,
      name,
      ticker,
      symbol,
      quantity: quantity || 1,
      buyPrice: c,
      currency,
    };

    setEditingStock(tempStock);
  };

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <GetParamId setParamId={setParamId} />
      </Suspense>
      {editingStock && (
        <FormEditPortfolio
          dataStock={editingStock}
          handleEditPortfolio={handleEditPortfolio}
        />
      )}
    </div>
  );
};

export default EditStock;
