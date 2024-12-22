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
    const response = await axios.post(`${BASE_URL}/auth/login-otp`, {
      mobile,
      national_code,
      referal_code,
      ...(recaptcha && { "g-recaptcha-response": recaptcha }),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response : new Error("Network Error");
  }
};

export const checkOtp = async (
  mobile,
  nationalCode,
  token,
  referal_code = "",
  recaptcha
) => {
  let national_code = nationalCode;
  try {
    const response = await axios.post(`${BASE_URL}/auth/check-otp`, {
      mobile,
      national_code,
      token,
      referal_code,
      ...(recaptcha && { "g-recaptcha-response": recaptcha }),
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response : new Error("Network Error");
  }
};
