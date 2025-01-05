"use client";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import React from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useMediaQuery } from "usehooks-ts";

import CardStock from "./CardStock";

import { getDataStocksByQuery } from "@/api/apiStock";
import { getUniqueId } from "@/dataEnv/myLib";

const AddStocks = () => {
  const [search, setSearch] = React.useState<string>("");
  const [dataStocks, setDataStocks] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleSearch = async (e: any) => {
    e.preventDefault();
    //console.log("searching:..", search);
    if (search === "") return;

    try {
      setDataStocks([]);
      setLoading(true);
      const response = await getDataStocksByQuery(search);

      //console.log("response getDataStocksByQuery: ", response);
      const { data, error } = response;

      if (data && !error) {
        //console.log("data: ", data);
        if (data.length === 0) {
          setError("No data found");
          setTimeout(() => {
            setError("");
          }, 2000);
        }
        setDataStocks(data);
      } else {
        console.log("error: ", error);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error in handleSearch", error);
      setLoading(false);
    }
  };

  const handleChangeSearch = async (e: any) => {
    // symbol, name, ISIN or Cusip.
    setDataStocks([]);
    const { value } = e.target;
    //console.log("search value: ", value);

    setSearch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    setDataStocks([]);
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">Add Stocks</h2>
      <Card
        className="me-auto ms-auto"
        style={{ width: isMobile ? "100%" : "50%" }}
      >
        <CardBody>
          <form onSubmit={handleSearch}>
            <div className="flex justify-center items-center gap-2">
              <Input
                label="Search Stock"
                placeholder="Search by symbol, name, ticker, ISIN or Cusip"
                value={search}
                onChange={handleChangeSearch}
              />
              <Button type="submit">
                <IoSearch className="text-2xl" style={{ cursor: "pointer" }} />
              </Button>
              <Button type="button" onPress={handleClearSearch}>
                <IoMdClose className="text-2xl" style={{ cursor: "pointer" }} />
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress aria-label="loading..." />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      {dataStocks.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Results only include stocks that are public or free to consult.
        </p>
      )}
      <div className="flex flex-wrap gap-4 mt-4 justify-center items-center">
        {dataStocks.map((dataCard: any) => (
          <CardStock key={getUniqueId()} dataCard={dataCard} />
        ))}
      </div>
    </div>
  );
};

export default AddStocks;
