/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const BASE_URL = 'https://natourspanel.onrender.com';


export const addTour = async (
  name,
  duration,
  maxGroupSize,
  difficulty,
  summary,
  price,
  imageCover,
  images,
) => {
  try {
    const url = `${BASE_URL}/api/v1/tours`;

    const res = await axios({
      method: 'POST',
      url,
      data: {
        name,
        duration,
        maxGroupSize,
        difficulty,
        summary,
        price,
        imageCover,
        images,
      },
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.status === 'success') {
      showAlert('success', `Tour added successfully!`);
    }
  } catch (err) {
    console.log(err.response.data);
    showAlert('error', err.response.data.message);
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  console.log(name, email, password, passwordConfirm);
  try {
    const res = await axios({
      method: 'POST',
      url: `${BASE_URL}/api/v1/users/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Successfully registered!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
