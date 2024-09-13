'use strict';

/* eslint-disable */

// polyfill bazı yeni javascript özelliklerinin eski browserlarda çalışmasını sağlar
// polyfill ilk sırada yer almalı !!!
// import '@babel/polyfill';
// // import $, { each } from 'jquery';
// import 'datatables.net';
// // import 'datatables.net-responsive';
// import { addTour, updateTour } from './tour';
// import axios from 'axios';
// import noUiSlider from 'nouislider';
// import $ from 'jquery';
// import select2 from 'select2';
// import Swal from 'sweetalert2';
// select2($);

const BASE_URL = 'https://natourspanel.onrender.com';

const base = window.location.origin + '/panel';

document.querySelector('.logout').addEventListener('click', async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: `${BASE_URL}/api/v1/users/logout`,
    });

    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
})

var showAlert = function (type, message) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: type,
    title: message,
  });
};

const rootStyles = getComputedStyle(document.documentElement);
const colorSuccess = rootStyles.getPropertyValue('--color-success');
const colorDanger = rootStyles.getPropertyValue('--color-danger');

function fadeIn(element, duration) {
  const interval = 10; // Her 10ms'de bir görünürlüğü artır
  const increase = interval / duration;

  element.style.display = 'block'; // Görünürlüğü aç
  element.style.opacity = '0';

  let opacity = 0;
  const fadeEffect = setInterval(function () {
    if (opacity < 1) {
      opacity += increase;
      element.style.opacity = opacity;
    } else {
      clearInterval(fadeEffect);
    }
  }, interval);
}

function fadeOut(element, duration) {
  const interval = 10; // Her 10ms'de bir görünürlüğü azalt
  const decrease = interval / duration;

  let opacity = 1;
  const fadeEffect = setInterval(function () {
    if (opacity > 0) {
      opacity -= decrease;
      element.style.opacity = opacity;
    } else {
      clearInterval(fadeEffect);
      element.style.display = 'none'; // Görünürlüğü kapat
    }
  }, interval);
}

function getImageSize(img) {
  // Resmin genişliğini ve yüksekliğini al
  const width = img.width;
  const height = img.height;

  // data-pswp-width ve data-pswp-height değerlerini ayarla
  img.parentElement.setAttribute('data-pswp-width', width);
  img.parentElement.setAttribute('data-pswp-height', height);
}

document.addEventListener('DOMContentLoaded', function () {
  const wavesButtons = document.querySelectorAll('.waves-effect');

  wavesButtons.forEach(function (wavesButton) {
    wavesButton.addEventListener('click', function (event) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      wavesButton.appendChild(ripple);

      const rippleLeft = event.pageX - wavesButton.getBoundingClientRect().left;
      const rippleTop = event.pageY - wavesButton.getBoundingClientRect().top;

      ripple.style.left = rippleLeft + 'px';
      ripple.style.top = rippleTop + 'px';
    });
  });
});

const sidebar = document.querySelector('.sidebar');
const tabs = document.querySelectorAll('.sidebar-nav__item');
const tabsContainer = document.querySelector('.sidebar-nav ul');
const tabsContent = document.querySelectorAll('.sidebar-nav__sub-content');
const sidebarNavSub = document.querySelector('.sidebar-nav__sub');
const sidebarNavSubContents = document.querySelector(
  '.sidebar-nav__sub-contents',
);
const overlay = document.querySelector('.overlay');

const filterForm = document.querySelector('.filter-form');
const filterClear = document.querySelector('.filter-clear');
const filterSearch = document.querySelector('.filter-search');
const filterInputs = document.querySelectorAll('.dashboard__filter input');
const filterSelects = document.querySelectorAll('select.filter-select');
const rangeInputs = document.querySelectorAll('.range-slider input');
const tableHeaders = document.querySelectorAll(
  '.dashboard__list th[data-name]',
);

const tableFields = Array.from(tableHeaders).map((header) =>
  header.getAttribute('data-name'),
);

tabsContainer.addEventListener('click', function (e) {
  // Kendisini seçiyor, child olan span'ı değil
  const clicked = e.target.closest('.sidebar-nav__item');

  // Guard clause
  if (!clicked) return;

  overlay.style.display = 'block';

  const currentActiveTab = document.querySelector('.sidebar-nav__item--active');

  // Eğer tıklanan sekme zaten aktifse
  if (clicked === currentActiveTab) {
    // sidebarNavSub.style.display = 'none';
    sidebarNavSub.style.borderLeft = 'none';
    // sidebarNavSub.style.marginLeft = '1px';
    fadeOut(sidebarNavSub, 300);
    fadeOut(overlay, 300);
    setTimeout(() => {
      sidebar.style.borderRadius = '8px';
    }, 300);
    return clicked.classList.remove('sidebar-nav__item--active');
  }

  if (currentActiveTab) {
    currentActiveTab.classList.remove('sidebar-nav__item--active');
  } else {
    fadeIn(sidebarNavSub, 300);
    fadeIn(overlay, 400);
  }

  tabsContent.forEach((tc) =>
    tc.classList.remove('sidebar-nav__sub-content--active'),
  );

  clicked.classList.add('sidebar-nav__item--active');

  document
    .querySelector(`[data-content="${clicked.dataset.tab}"]`)
    .classList.add('sidebar-nav__sub-content--active');

  sidebarNavSub.style.display = 'block';
  sidebarNavSub.style.marginLeft = '0';
  // sidebarNavSub.style.borderLeft = 'solid #dadce0 1px';
  sidebarNavSubContents.style.display = 'block';
  sidebar.style.borderRadius = '8px 0px 0px 8px';
});

overlay.addEventListener('click', function (e) {
  console.log('123');
  const currentActiveTab = document.querySelector('.sidebar-nav__item--active');
  if (!currentActiveTab) return;
  overlay.style.display = 'none';
  fadeOut(sidebarNavSub, 300);
  fadeOut(overlay, 300);
  sidebar.style.borderRadius = '8px';
  if (currentActiveTab)
    currentActiveTab.classList.remove('sidebar-nav__item--active');
});

////////////////////////////////////
// TABLE ACTIONS

let collection = document.querySelector('#dataTable');
if (collection) collection = collection.dataset.table;

const createFields = function () {
  const filters = {};
  tableFields.forEach((input) => {
    filters[input] = `${input}`;
  });
  const fields = Object.keys(filters).join(',');
  return fields;
};

function generateQueryString(filters) {
  let queryString = '';

  // Tüm alanlar için kontrol yap
  for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      const value = filters[key];
      // Eğer alan -gte veya -lte ile bitiyorsa ve değerleri 0'a eşit değilse
      if (key.endsWith('-gte') || key.endsWith('-lte')) {
        const newKey = key.replace('-gte', '[gte]').replace('-lte', '[lte]');
        if (parseFloat(value) !== 0) {
          queryString += `${newKey}=${value}&`;
        }
      } else {
        queryString += `${key}=${value}&`;
      }
    }
  }

  // Son karakter "&" ise kaldır
  if (queryString.endsWith('&')) {
    queryString = queryString.slice(0, -1);
  }

  return queryString;
}

const sliders = {};

function createRangeSlider(selector, min, max) {
  const slider = document.querySelector(selector);

  if (!slider) return;

  const inputs = [
    document.querySelector(`#${selector.split('__')[1]}-gte`),
    document.querySelector(`#${selector.split('__')[1]}-lte`),
  ];

  noUiSlider.create(slider, {
    start: [0, 0],
    connect: true,
    range: {
      min: min,
      max: max,
    },
    tooltips: true,
  });

  slider.noUiSlider.on('update', function (values, handle) {
    inputs[handle].value = values[handle];
  });

  // Oluşturulan slider'ı nesneye ekleyin
  sliders[selector] = slider;
}

const updateDataTable = async (url) => {
  try {
    const filters = {};

    filterInputs.forEach((input) => {
      const inputValue = input.value.trim();
      if (!isNaN(inputValue)) {
        // Eğer input değeri bir sayı ise
        if (inputValue) {
          filters[input.getAttribute('name')] = inputValue;
        }
      } else {
        // Eğer input değeri bir metin ise
        if (inputValue) {
          filters[input.getAttribute('name')] = `*${inputValue}*`;
        }
      }
    });

    filterSelects.forEach((select) => {
      const selectedOption = select.options[select.selectedIndex];
      const selectedValue = selectedOption.value;
      if (selectedValue) {
        filters[select.getAttribute('name')] = selectedValue;
      }
    });
    const queryString = generateQueryString(filters);
    console.log(queryString);
    const updatedUrl = `${url}&${queryString}`;

    const res = await axios.get(updatedUrl);
    const { data } = res.data;

    // DataTables'i güncelleme işlemi
    if (dataTable) {
      dataTable.clear(); // Tabloyu temizle
      dataTable.rows.add(data); // Yeni verileri ekle
      dataTable.draw(); // Tabloyu yeniden çiz
    }
  } catch (err) {
    console.error('Error:', err);
  }
};

//////////////////////////////////////////
// FILTER CLEAR AND SEARCH

if (filterClear) {
  filterClear.addEventListener('click', function (e) {
    filterInputs.forEach((input) => {
      input.value = '';
    });

    rangeInputs.forEach((input) => {
      input.value = '';
    });

    // Tüm sliderları sıfırla
    for (const selector in sliders) {
      if (sliders.hasOwnProperty(selector)) {
        sliders[selector].noUiSlider.reset();
      }
    }

    $('.filter-select').each(function (index, element) {
      $(element).val(null).trigger('change');
    });

    const fields = createFields();
    const url = `${BASE_URL}/api/v1/${collection}?fields=${fields}`;
    updateDataTable(url);
  });
}

if (filterSearch) {
  filterSearch.addEventListener('click', function (e) {
    const fields = createFields();
    const url = `${BASE_URL}/api/v1/${collection}?fields=${fields}`;
    updateDataTable(url);
  });

  $('.filter-select').select2({
    width: '100%',
  });
  $('.edit-select').select2({
    width: '100%',
  });
}

document
  .querySelector('.header__extend')
  .addEventListener('click', function () {
    const container = document.querySelector('.container');
    const sidebar = document.querySelector('.sidebar');
    const sidebarItems = document.querySelectorAll('.sidebar-nav__item a');

    if (container.classList.contains('container--extended')) {
      // Eğer container sınıfı "container--extended" içeriyorsa, kaldır
      container.classList.remove('container--extended');
      sidebar.classList.remove('w-14');
      sidebarItems.forEach(function (sidebarItem) {
        sidebarItem.classList.remove('hidden-text', 'justify-center', 'gap-0');
      });
    } else {
      // Eğer container sınıfı "container--extended" içermiyorsa, ekle
      container.classList.add('container--extended');
      sidebar.classList.add('w-14');

      sidebarItems.forEach(function (sidebarItem) {
        sidebarItem.classList.add('hidden-text', 'justify-center', 'gap-0');
      });
    }
  });

function decodeEntities(encodedString) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = encodedString;
  return textArea.value;
}

function isHTML(str) {
  var doc = new DOMParser().parseFromString(str, 'text/html');
  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
}
