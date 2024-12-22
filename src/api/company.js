import axios from "axios";
import Cookies from "js-cookie";

// Base URL and token for API requests
import { BASE_URL } from "../const";
var token;

export const storeCompanies = async (
  title,
  description,
  agent_name,
  field,
  phone_number,
  fund_needed,
  anual_income,
  profit,
  bounced_check,
  recaptchaToken
) => {
  token = Cookies.get("flutter.token");
  try {
    const response = await axios.post(
      `${BASE_URL}/companies/`,
      {
        title: title,
        ...(description && { description: description }),

        agent_name: agent_name,
        field: field,
        phone_number: phone_number,
        fund_needed: fund_needed,
        anual_income: anual_income,
        profit: profit,
        bounced_check: bounced_check,
        ...(recaptchaToken && { "g-recaptcha-response": recaptchaToken }),
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Assuming token is defined elsewhere
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error.response ? error.response : new Error('Network Error');
  }
};
