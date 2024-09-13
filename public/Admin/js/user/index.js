// 'use strict';

// /* eslint-disable */


// const base = window.location.origin + '/panel';

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-end',
//   showConfirmButton: false,
//   timer: 3000,
//   timerProgressBar: true,
// });

// const rootStyles = getComputedStyle(document.documentElement);
// const colorSuccess = rootStyles.getPropertyValue('--color-success');
// const colorDanger = rootStyles.getPropertyValue('--color-danger');

// function fadeIn(element, duration) {
//   const interval = 10; // Her 10ms'de bir görünürlüğü artır
//   const increase = interval / duration;

//   element.style.display = 'block'; // Görünürlüğü aç
//   element.style.opacity = '0';

//   let opacity = 0;
//   const fadeEffect = setInterval(function () {
//     if (opacity < 1) {
//       opacity += increase;
//       element.style.opacity = opacity;
//     } else {
//       clearInterval(fadeEffect);
//     }
//   }, interval);
// }

// function fadeOut(element, duration) {
//   const interval = 10; // Her 10ms'de bir görünürlüğü azalt
//   const decrease = interval / duration;

//   let opacity = 1;
//   const fadeEffect = setInterval(function () {
//     if (opacity > 0) {
//       opacity -= decrease;
//       element.style.opacity = opacity;
//     } else {
//       clearInterval(fadeEffect);
//       element.style.display = 'none'; // Görünürlüğü kapat
//     }
//   }, interval);
// }

// const sidebar = document.querySelector('.sidebar');
// const tabs = document.querySelectorAll('.sidebar-nav__item');
// const tabsContainer = document.querySelector('.sidebar-nav ul');
// const tabsContent = document.querySelectorAll('.sidebar-nav__sub-content');
// const sidebarNavSub = document.querySelector('.sidebar-nav__sub');
// const sidebarNavSubContents = document.querySelector(
//   '.sidebar-nav__sub-contents',
// );
// const overlay = document.querySelector('.overlay');

// tabsContainer.addEventListener('click', function (e) {
//   // Kendisini seçiyor, child olan span'ı değil
//   const clicked = e.target.closest('.sidebar-nav__item');

//   // Guard clause
//   if (!clicked) return;

//   overlay.style.display = 'block';

//   const currentActiveTab = document.querySelector('.sidebar-nav__item--active');

//   // Eğer tıklanan sekme zaten aktifse
//   if (clicked === currentActiveTab) {
//     // sidebarNavSub.style.display = 'none';
//     sidebarNavSub.style.borderLeft = 'none';
//     sidebarNavSub.style.marginLeft = '1px';
//     fadeOut(sidebarNavSub, 300);
//     setTimeout(() => {
//       sidebar.style.borderRadius = '8px';
//     }, 300);
//     return clicked.classList.remove('sidebar-nav__item--active');
//   }

//   if (currentActiveTab) {
//     currentActiveTab.classList.remove('sidebar-nav__item--active');
//   } else {
//     fadeIn(sidebarNavSub, 300);
//   }

//   tabsContent.forEach((tc) =>
//     tc.classList.remove('sidebar-nav__sub-content--active'),
//   );

//   clicked.classList.add('sidebar-nav__item--active');

//   document
//     .querySelector(`[data-content="${clicked.dataset.tab}"]`)
//     .classList.add('sidebar-nav__sub-content--active');

//   sidebarNavSub.style.display = 'block';
//   sidebarNavSub.style.marginLeft = '0';
//   // sidebarNavSub.style.borderLeft = 'solid #dadce0 1px';
//   sidebarNavSubContents.style.display = 'block';
//   sidebar.style.borderRadius = '8px 0px 0px 8px';
// });

// overlay.addEventListener('click', function (e) {
//   const currentActiveTab = document.querySelector('.sidebar-nav__item--active');
//   if (!currentActiveTab) return;
//   overlay.style.display = 'none';
//   fadeOut(sidebarNavSub, 300);
//   sidebar.style.borderRadius = '8px';
//   if (currentActiveTab)
//     currentActiveTab.classList.remove('sidebar-nav__item--active');
// });

// const createFields = function () {
//   const filters = {};
//   tableFields.forEach((input) => {
//     filters[input] = `${input}`;
//   });
//   const fields = Object.keys(filters).join(',');
//   return fields;
// };

// function generateQueryString(filters) {
//   let queryString = '';

//   // Tüm alanlar için kontrol yap
//   for (const key in filters) {
//     if (filters.hasOwnProperty(key)) {
//       const value = filters[key];

//       // Eğer alan -gte veya -lte ile bitiyorsa ve değerleri 0'a eşit değilse
//       if (key.endsWith('-gte') || key.endsWith('-lte')) {
//         const newKey = key.replace('-gte', '[gte]').replace('-lte', '[lte]');
//         if (parseFloat(value) !== 0) {
//           queryString += `${newKey}=${value}&`;
//         }
//       } else {
//         queryString += `${key}=${value}&`;
//       }
//     }
//   }

//   // Son karakter "&" ise kaldır
//   if (queryString.endsWith('&')) {
//     queryString = queryString.slice(0, -1);
//   }

//   return queryString;
// }

// const updateDataTable = async (url) => {
//   try {
//     const filters = {};

//     const selectedOption = filterSelect.options[filterSelect.selectedIndex];
//     const selectedValue = selectedOption.value;

//     filterInputs.forEach((input) => {
//       const inputValue = input.value.trim();
//       if (!isNaN(inputValue)) {
//         // Eğer input değeri bir sayı ise
//         if (inputValue) {
//           filters[input.getAttribute('name')] = inputValue;
//         }
//       } else {
//         // Eğer input değeri bir metin ise
//         if (inputValue) {
//           filters[input.getAttribute('name')] = `*${inputValue}*`;
//         }
//       }
//     });

//     if (selectedValue) {
//       filters['difficulty'] = selectedValue;
//     }

//     const queryString = generateQueryString(filters);
//     console.log(queryString);
//     const updatedUrl = `${url}&${queryString}`;

//     const res = await axios.get(updatedUrl);
//     const { data } = res.data;

//     // DataTables'i güncelleme işlemi
//     if (dataTable) {
//       dataTable.clear(); // Tabloyu temizle
//       dataTable.rows.add(data); // Yeni verileri ekle
//       dataTable.draw(); // Tabloyu yeniden çiz
//     }
//   } catch (err) {
//     console.error('Error:', err);
//   }
// };

// const filterForm = document.querySelector('.filter-form');
// const filterClear = document.querySelector('.filter-clear');
// const filterSearch = document.querySelector('.filter-search');
// const filterInputs = document.querySelectorAll('.dashboard__filter input');
// const filterSelect = document.querySelector('select.filter-select');
// const rangeInputs = document.querySelectorAll('.range-slider input');
// const tableHeaders = document.querySelectorAll(
//   '.dashboard__list th[data-name]',
// );
// const tableFields = Array.from(tableHeaders).map((header) =>
//   header.getAttribute('data-name'),
// );

// let dataTable;

// const initializeDataTable = async function () {
//   try {
//     const fields = createFields();
//     const url = `http://127.0.0.1:3000/api/v1/users?fields=${fields}`;

//     const res = await axios.get(url);

//     const { data } = res.data;

//     dataTable = $('#dataTable').DataTable({
//       processing: false,
//       responsive: true,
//       paging: true,
//       info: false,
//       width: '100%',
//       lengthMenu: [1, 2, 10, 25, 50, 100],
//       pageLength: 10,
//       language: {
//         sLengthMenu: '_MENU_',
//         paginate: {
//           next: '<svg width="8px" height="8px" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="rotate(270)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.707540,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g> </svg>',
//           previous:
//             '<svg width="8px" height="8px" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="rotate(90)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.707540,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g> </svg>',
//         },
//       },
//       dom: "<'table-list-top'lp>" + 'tr',
//       data,
//       columns: [
//         { data: '_id' },
//         { data: 'photo' },
//         { data: 'email' },
//         { data: 'name' },
//         { data: 'role' },
//         {
//           data: null,
//           render: function (data, type, row) {
//             return `
//             <div class="table-actions">
//               <a class="table-actions__edit" href="${base}/user/edit/${row.id}"><svg><use xlink:href="/img/icons.svg#icon-edit"></use></svg></a>
//               <a class="table-actions__delete" href="javascript:void(0)" data-id="${row.id}" data-type='delete'><svg><use xlink:href="/img/icons.svg#icon-delete"></use></svg></a>
//             </div>`;
//           }, 
//         },
//       ],
//     });
//   } catch (err) {
//     console.error('Error:', err);
//   }
// };

// document.addEventListener('DOMContentLoaded', () => {
//   initializeDataTable();

//   const dataTable = document.querySelector('#dataTable');

//   dataTable.addEventListener('click', async function (e) {
//     const clicked = e.target.closest('.table-actions__delete');

//     // Guard clause
//     if (!clicked) return;

//     const rowId = clicked.dataset.id;

//     Swal.fire({
//       title: 'Warning!',
//       text: 'Are you sure you want to do delete?',
//       icon: 'warning',
//       showCancelButton: true,
//       cancelButtonText: 'No',
//       confirmButtonText: 'Yes',
//       confirmButtonColor: colorSuccess,
//       cancelButtonColor: colorDanger,
//       reverseButtons: true,
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const response = await axios.delete(
//             `http://127.0.0.1:3000/api/v1/users/${rowId}`,
//           );

//           dataTable.row(clicked.closest('tr')).remove().draw();
//           Toast.fire({
//             icon: 'success',
//             title: 'Successfully Deleted'
//           })
//         } catch (error) {
//           console.error(error);
//           Toast.fire({
//             icon: 'Error',
//             title: 'Deletion Failed'
//           })
//         }
//       }
//     });
//   });
// });

// const sliders = {};

// function createRangeSlider(selector, min, max) {
//   const slider = document.querySelector(selector);
//   const inputs = [
//     document.querySelector(`#${selector.split('__')[1]}-gte`),
//     document.querySelector(`#${selector.split('__')[1]}-lte`),
//   ];

//   noUiSlider.create(slider, {
//     start: [0, 0],
//     connect: true,
//     range: {
//       min: min,
//       max: max,
//     },
//     tooltips: true,
//   });

//   slider.noUiSlider.on('update', function (values, handle) {
//     inputs[handle].value = values[handle];
//   });

//   // Oluşturulan slider'ı nesneye ekleyin
//   sliders[selector] = slider;
// }


// //////////////////////////////////////////
// // FILTER CLEAR AND SEARCH

// filterClear.addEventListener('click', function (e) {
//   filterInputs.forEach((input) => {
//     input.value = '';
//   });

//   rangeInputs.forEach((input) => {
//     input.value = '';
//   });

//   // Tüm sliderları sıfırla
//   for (const selector in sliders) {
//     if (sliders.hasOwnProperty(selector)) {
//       sliders[selector].noUiSlider.reset();
//     }
//   }

//   $('.filter-select').val(null).trigger('change');

//   const fields = createFields();
//   const url = `http://127.0.0.1:3000/api/v1/users?fields=${fields}`;
//   updateDataTable(url);
// });

// filterSearch.addEventListener('click', function (e) {
//   const fields = createFields();
//   const url = `http://127.0.0.1:3000/api/v1/users?fields=${fields}`;
//   updateDataTable(url);
// });

// $('.filter-select').select2({
//   width: '100%',
// });