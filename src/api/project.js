// src/api/project.js
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../const';


export const fetchProjects = async () => {

  

  try {
    const response = await axios.get(`${BASE_URL}/projects`, {
     
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const getProject = async (uuid) => {
  try {
    const response = await axios.get(`${BASE_URL}/projects/${uuid}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Function to fetch certificate PDF for a project
export const getCertificate = async (projectUuid) => {
  const token = Cookies.get('flutter.token');
  if (!token) throw new Error("No token found");
  try {
    const response = await axios.get(`${BASE_URL}/projects/${projectUuid}/certificate/pdf`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming token is defined elsewhere
      },
    });
    return response.data.link;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  }
};

// Function to fetch investors for a project
export const getInvesters = async (projectUuid, perPage, page) => {
  const token = Cookies.get('flutter.token');
  try {
    const response = await axios.get(`${BASE_URL}/projects/${projectUuid}/investers`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`, // Assuming token is defined elsewhere
      },
      params: {
        per_page: perPage,
        page: page,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  }
};
