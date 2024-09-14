/* eslint-disable */

// polyfill bazı yeni javascript özelliklerinin eski browserlarda çalışmasını sağlar
// polyfill ilk sırada yer almalı !!!
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { addTour } from './tour';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import Swiper from 'swiper';
import axios from 'axios';

// DOM ELEMENTS
const swiper = new Swiper('.swiper', {
  effect: 'fade',
  navigation: { nextEl: '.slide-next', prevEl: '.slide-prev' },
  loop: !0,
});

const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const tourAddForm = document.querySelector('.form-add-tour');
// DELAGATION
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}

// if (tourAddForm) {
//   tourAddForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const passwordConfirm = document.getElementById('passwordConfirm').value;

//     form.append('name', document.getElementById('name').value);
//     form.append('duration', document.getElementById('duration').value);
//     form.append('maxGroupSize', document.getElementById('maxGroupSize').value);
//     form.append('difficulty', document.getElementById('difficulty').value);
//     form.append('summary', document.getElementById('summary').value);
//     form.append('price', document.getElementById('price').value);
//     form.append('imageCover', document.getElementById('imageCover').files[0]);
//     form.append('images', document.getElementById('images').files[0]);
//     addTour(name, email, password, passwordConfirm);
//   });
// }

if (tourAddForm) {
  tourAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const duration = document.getElementById('duration').value;
    const maxGroupSize = document.getElementById('maxGroupSize').value;
    const difficulty = document.getElementById('difficulty').value;
    const summary = document.getElementById('summary').value;
    const price = document.getElementById('price').value;
    const imageCover = document.getElementById('imageCover').files[0];
    const images = document.getElementById('images').files[0];
    addTour(
      name,
      duration,
      maxGroupSize,
      difficulty,
      summary,
      price,
      imageCover,
      images,
    );
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // *** apisiz form yüklemesinde multipart/form-data kullanılıyordu
    // API için ise aşağıdaki gibi yapılması gerekiyopr
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
    // resim eklemeyi yapımca alttakine gerek kalmadı
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
    // updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating ...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );
    // await koydum ki sonra aşağıdaki kod blokuna geçebilsin
    document.querySelector('.btn--save-password').textContent =
      'Save passwords';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    console.log('123');
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

document.addEventListener('DOMContentLoaded', function () {
  const languageItems = document.querySelectorAll('.language-box li');

  const handleLanguageChange = async (item) => {
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
      await handleLanguageChange(item);
    });
  });
});
