import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const getDataStocksByQuery = async (query) => {
  try {
    const response = await axios.get(`${hostURL}/api/stock/query/${query}`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getDataStocksByQuery:..", error);

    return error.response;
  }
};
