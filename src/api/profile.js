// src/api/profile.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../const';
var token;

export const fetchUserProfile = async () => {
  token =  Cookies.get('flutter.token');

  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data.user;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
export const fetchProfile = async () => {
  token =  Cookies.get('flutter.token');

  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};
export const updateProfile = async (profileData) => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.post(`${BASE_URL}/auth/signin`, profileData,{
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
    
  }
};

export const fetchUser = async () => {
  token =  Cookies.get('flutter.token');
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.get(`${BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const fetchUserInvitesByProjectUUid = async (project_uuid , perPage , page) => {
  token =  Cookies.get('flutter.token');

  try {
    const response = await axios.get(`${BASE_URL}/auth/invites?project_uuid=${project_uuid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: {
        per_page: perPage,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};