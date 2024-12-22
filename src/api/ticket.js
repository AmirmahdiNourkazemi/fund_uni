// src/api/ticket.js
import axios from 'axios';
import Cookies from 'js-cookie';

import { BASE_URL } from '../const';

const getToken = () => {
  const token = Cookies.get('flutter.token');
  // console.log('Token:', token); // Log token for debugging
  return token;
};

export const storeTicket = async (title, description, category , recaptchaToken) => {
  const token = getToken();
 
  try {
    const response = await axios.post(
      `${BASE_URL}/tickets`,
      {
        title,
        description,
        category,
        message: { text: description },
        ...(recaptchaToken && { "g-recaptcha-response": recaptchaToken }),
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    
    throw error.response ? error.response : new Error('Network Error');
  }
};

export const storeMessage = async (uuid, text , recaptchaToken) => {
  const token = getToken();
  try {
    await axios.post(
      `${BASE_URL}/tickets/${uuid}/messages`,
      { text ,
        ...(recaptchaToken && { "g-recaptcha-response": recaptchaToken }),
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
  
    throw error.response ? error.response : new Error('Network Error');
  }
};

export const getTickets = async (perPage, page) => {
  const token = getToken();
  try {
    const response = await axios.get(
      `${BASE_URL}/tickets`,
      {
        params: { per_page: perPage, page },
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error); // Log error for debugging
    throw error.response ? error.response.data.message : new Error('Network Error');
  }
};

export const getTicketByUUID = async (uuid) => {
  const token = getToken();
  try {
    const response = await axios.get(`${BASE_URL}/tickets/${uuid}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error); // Log error for debugging
    throw error.response ? error.response.data.message : new Error('Network Error');
  }
};

export const closeTicket = async (uuid) => {
  const token = getToken();
  try {
    await axios.put(
      `${BASE_URL}/tickets/${uuid}/close`,
      {},
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error:', error); // Log error for debugging
    throw error.response ? error.response.data.message : new Error('Network Error');
  }
};
