import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { addStockToPortfolio } from "@/api/apiPortfolio";
import { DataUser, RootState } from "@/redux/userSlice";
import { getUniqueId } from "@/dataEnv/myLib";

interface CardStockProps {
  dataCard: any;
}

const CardStock: FC<CardStockProps> = ({ dataCard }) => {
  const router = useRouter();
  const user: DataUser = useSelector((state: RootState) => state.user);
  const { logo, ...restData } = dataCard;
  //const dataKeys = Object.keys(restData);
  const {
    symbol,
    name,
    ticker,
    c,
    currency,
    isDashboard,
    date,
    quantity,
    currentPrice,
  } = restData;
  const [isPositive] = useState<boolean>(currentPrice > c);

  //console.log("dataCard: ", dataCard);

  const handleAddStock = async () => {
    //console.log("Add Stock: ", dataCard);

    if (!user.email || !user.access_token) {
      console.error("User not logged in");

      return;
    }

    try {
      const tempDataCard = {
        ...dataCard,
        id: getUniqueId(),
      };
      const response = await addStockToPortfolio(
        user.access_token,
        tempDataCard
      );

      console.log("response addStockToPortfolio: ", response);
      const { data, error } = response;

      if (data && !error) {
        console.log("Stock added to portfolio: ", data);
        router.push("/stocks");
      } else {
        console.error("Error in handleAddStock: ", error);
      }
    } catch (error) {
      console.error("Error in handleAddStock", error);
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
    <Card className="py-4" style={{ width: "300px" }}>
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h3 className="text-lg font-semibold">Name: {name}</h3>
        <p className="text-sm text-gray-500">Symbol: {symbol}</p>
        <p className="text-sm text-gray-500">Ticker: {ticker}</p>
        <p className="text-sm text-gray-500">Currency: {currency}</p>
        <p className="text-sm text-gray-500">Buy Price: $ {c}</p>
        {isDashboard && (
          <>
            <p className="text-sm text-gray-500">Quantity: {quantity || 1}</p>
            <p className={isDashboard ? "text-sm" : "text-sm text-gray-500"}>
              Current Price:{" "}
              <span className={isPositive ? "text-success" : "text-danger"}>
                $ {currentPrice}
              </span>
            </p>
            <p className="text-sm">Date: {formatMyDate(date)}</p>
          </>
        )}
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <div
          className="flex flex-col justify-center items-center"
          style={{ height: "300px" }}
        >
          <Image
            alt="Logo Stock"
            className="object-cover rounded-xl"
            src={logo || "/logoHelp.png"}
            width={270}
          />
        </div>
      </CardBody>
      <CardFooter className="flex justify-center items-center">
        <Button
          className={isDashboard ? "hidden" : ""}
          color="primary"
          onPress={handleAddStock}
        >
          Add Stock
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardStock;
