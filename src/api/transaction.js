import axios from 'axios';
import Cookies from 'js-cookie';

import { BASE_URL } from '../const';
var token;

export const getTransaction = async (perPage, page, status) => {
  token =  Cookies.get('flutter.token');

  try {
    const response = await axios.get(`${BASE_URL}/transactions`, {
      params: {
        per_page: perPage,
        page: page,
        status: status, // Include status if necessary
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
