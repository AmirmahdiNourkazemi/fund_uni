import axios from 'axios';
import Cookies from 'js-cookie';

// Base URL and token for API requests
import { BASE_URL } from '../const';
var token;

// Function to handle errors
const handleApiError = (error) => {
  if (error.response) {
    throw error.response ? error.response : new Error('Network Error');
  } else {
    throw new Error('unknown error happened');
  }
};

// Function to go to payment
export const goToPayment = async (projectId, amount, fromWallet, isPublic , recaptchaToken) => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.post(
      `${BASE_URL}/gateway`,
      {
        description: 'خرید طرح',
        project_id: projectId,
        amount: amount,
        from_wallet: fromWallet,
        public: isPublic,
        ...(recaptchaToken && { "g-recaptcha-response": recaptchaToken }),
       
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to store a withdrawal request
export const storeWithdraw = async (amount, iban) => {
  token =  Cookies.get('flutter.token');
  try {
    await axios.post(
      `${BASE_URL}/withdraws`,
      {
        amount: amount,
        iban: iban,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Function to get withdrawal details
export const getWithdraw = async () => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.get(
      `${BASE_URL}/withdraws`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to pay from wallet
export const paidWallet = async (projectId, amount, isPublic) => {
  token =  Cookies.get('flutter.token');
  try {
    await axios.put(
      `${BASE_URL}/projects/${projectId}/buy`,
      {
        amount: amount,
        public: isPublic,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Function to deposit to wallet
export const depositWallet = async (amount) => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.post(
      `${BASE_URL}/gateway`,
      {
        description: 'خرید طرح',
        amount: amount,
      
      },
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to store track deposit
export const storeTrackDeposit = async (projectId,amount, trackCode, date, imageFile) => {
  const token = Cookies.get('flutter.token');

  const formData = new FormData();
  formData.append('amount', amount);
  formData.append('ref_id', trackCode);
  formData.append('deposit_date', date);
  formData.append('image', imageFile);
  formData.append('project_id', projectId);

  try {
    await axios.post(
      `${BASE_URL}/deposits`,
      formData,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Important for file upload
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// Function to get deposit details
export const getDeposit = async () => {
  token =  Cookies.get('flutter.token');
  try {
    const response = await axios.get(
      `${BASE_URL}/deposits`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
