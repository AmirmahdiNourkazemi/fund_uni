import axios from 'axios';
import Cookies from 'js-cookie';



import { BASE_URL } from '../const';
var token;



export const getWarranty = async () => {
    token =  Cookies.get('flutter.token');
  
    try {
      const response = await axios.get(`${BASE_URL}/warranties`, {
    
        headers: {
          'Accept': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };