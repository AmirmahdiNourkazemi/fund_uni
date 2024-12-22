// src/api/axiosInstance.js
import axios from 'axios';
import Cookies from 'js-cookie';

import { BASE_URL } from '../const';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${Cookies.get('flutter.token')}`
  }
});

export default axiosInstance;
