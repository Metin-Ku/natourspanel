/* eslint-disable */

import axios from 'axios';

const languageItems = document.querySelectorAll('.language-box li');

export const languageChange = async (item) => {
  try {
    const newLanguage = item.getAttribute('data-lang');
    const response = await axios.get(`/change-language/${newLanguage}`);
    window.location.reload();
  } catch (error) {
    console.error('Dil değiştirme hatası:', error);
  }
};

languageItems.forEach((item) => {
  item.addEventListener('click', async function () {
    await languageChange(item);
  });
});