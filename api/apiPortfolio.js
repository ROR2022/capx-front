import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const getDataPortfolioByUser = async (token) => {
  //console.log("getDataPortfolioByUser token:", token);
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`${hostURL}/api/portfolio/dataPortfolio`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getDataPortfolioById:..", error);

    return error.response;
  }
};

export const getDataDashboardByUser = async (token) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`${hostURL}/api/portfolio/dataDashboard`);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error getDataDashboardByUser:..", error);

    return error.response;
  }
};

export const addStockToPortfolio = async (token, stock) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.post(
      `${hostURL}/api/portfolio/addStock`,
      stock
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error addStockToPortfolio:..", error);

    return error.response;
  }
};

export const updateStocksByUserId = async (token, stocks) => {
  try {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.put(
      `${hostURL}/api/portfolio/updateStocks`,
      stocks,
    );

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error updateStocksByUserId:..", error);

    return error.response;
  }
};
