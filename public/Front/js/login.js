/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const BASE_URL = 'https://natourspanel.onrender.com';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', res.data.message || 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log('err: ', err);
    // Hata yanıtı yoksa genel bir mesaj göster
    const errorMessage =
      (err.response && err.response.data && err.response.data.message) ||
      'Something went wrong. Please try again later.';
    showAlert('error', errorMessage);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/v1/users/logout`,
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
