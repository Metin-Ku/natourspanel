/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const BASE_URL = 'https://natourspanel.onrender.com';


// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `${BASE_URL}/api/v1/users/updateMyPassword`
        : `${BASE_URL}/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => {
      //   location.reload();
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
