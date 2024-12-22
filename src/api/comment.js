// src/api/comment.js
import axios from 'axios';
import Cookies from 'js-cookie';

import { BASE_URL } from '../const';
var token;
// Function to store a comment
export const storeComment = async (uuid, body, parentID , recaptchaToken) => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.post(
      `${BASE_URL}/projects/${uuid}/comments`,
      {
        body: body,
        parent_id: parentID ? parentID.toString() : undefined,
        ...(recaptchaToken && { "g-recaptcha-response": recaptchaToken }),
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming token is defined elsewhere
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    throw error.response ? error.response : new Error('Network Error');
  }
};

// Function to fetch comments for a project
export const getComments = async (uuid) => {
  token =  Cookies.get('flutter.token');
  try {
    
    const response = await axios.get(
      `${BASE_URL}/projects/${uuid}/comments`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming token is defined elsewhere
        },
      }
    );
    return response.data; // Return the response data

  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
  }
};
