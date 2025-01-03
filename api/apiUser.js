import axios from "axios";

import { hostURL } from "../dataEnv/dataEnv";

export const registerUser = async (data) => {
  try {
    const response = await axios.post(`${hostURL}/api/auth/register`, data);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error registerUser:..", error);

    return error.response;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await axios.post(`${hostURL}/api/auth/login`, data);

    return response;
  } catch (error) {
    //eslint-disable-next-line
    console.log("error loginUser:..", error);

    return error.response;
  }
};
