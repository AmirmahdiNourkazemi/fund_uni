// src/api/auth.js
import axios from "axios";
import { BASE_URL } from "../const";

export const loginWithOtp = async (
  mobile,
  nationalCode,
  referal_code = "",
  recaptcha
) => {
  let national_code = nationalCode;

  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      mobile,
      national_code,
     
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response : new Error("Network Error");
  }
};


