"use client";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Tooltip,
} from "@nextui-org/react";

import ConfirmModal, { DataModalType } from "../ConfirmModal/ConfirmModal";

import { EditIcon, DeleteIcon } from "./TableIcons";

//import { getUniqueId } from "@/dataEnv/myLib";

export const columns = [
  { name: "STOCK", uid: "stock" },
  { name: "SYMBOL", uid: "symbol" },
  { name: "COUNTRY", uid: "country" },
  { name: "BUY PRICE", uid: "c" },
  { name: "ACTIONS", uid: "actions" },
];

export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

/* const statusColorMap: any = {
  active: "success",
  paused: "danger",
  vacation: "warning",
}; */

interface TableStocksProps {
  data: any;
  editStocks: (item: any) => void;
}

const TableStocks: FC<TableStocksProps> = ({ data, editStocks }) => {
  const [dataStocks, setDataStocks] = useState<any>([]);
  const [dataModal, setDataModal] = useState<DataModalType | null>(null);
  const router = useRouter();

  useEffect(() => {
    parseData(data);
  }, [data]);

  useEffect(() => {
    if (dataModal && dataModal.action === "Confirmed") {
      //console.log("dataModal: ", dataModal);
      if (dataModal.payload) {
        //console.log("Delete: ", dataModal.payload);
        editStocks(dataModal.payload);
      }
    }
  }, [dataModal]);

  const parseData = (data: any) => {
    //console.log("parseData", data);
    const parsedData = data.map((item: any) => {
      return {
        ...item,
      };
    });

    //console.log("parsedData", parsedData);

    setDataStocks(parsedData.reverse());
  };

  const handleEdit = (item: any) => {
    console.log("Edit: ", item);
    router.push(`/edit-stock?id=${item.id}`);
  };

  const handleDelete = (item: any) => {
    //console.log("Delete: ", item);
    setDataModal({
      title: "Delete Stock",
      message: "Are you sure you want to delete this stock?",
      action: "Delete",
      payload: item,
    });
  };

  const renderCell = React.useCallback((item: any, columnKey: any) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "stock":
        return (
          <User
            avatarProps={{ radius: "lg", src: item.logo }}
            description={item.exchange || "N/A"}
            name={item.name}
          />
        );
      case "symbol":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {item.ticker}
            </p>
          </div>
        );
      case "country":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {item.currency}
            </p>
          </div>
        );
      case "c":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">$ {cellValue}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit stock">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon onClick={() => handleEdit(item)} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete stock">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={() => handleDelete(item)} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      {dataModal && dataModal.title !== "" && (
        <ConfirmModal dataModal={dataModal} setDataModal={setDataModal} />
      )}
      <p className="text-gray-500 text-sm">Total Stocks: {dataStocks.length}</p>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={dataStocks}>
          {(item: any) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableStocks;
