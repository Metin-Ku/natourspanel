/* eslint-disable */

// import axios from 'axios';
// import { showAlert } from './alerts';

///////////////////////////////////////////
// LIST

const table = document.querySelector('#dataTable');
let dataTable;

const initializeDataTable = async function () {
  try {
    let fields = createFields();
    fields += ',slug';
    const url = `${BASE_URL}/api/v1/tours?fields=${fields}`;
    const resp = await axios.get(url);
    const { data } = resp.data;

    dataTable = $('#dataTable').DataTable({
      processing: false,
      responsive: true,
      paging: true,
      info: false,
      width: '100%',
      lengthMenu: [1, 2, 10, 25, 50, 100],
      pageLength: 10,
      language: {
        sLengthMenu: '_MENU_',
        paginate: {
          next: '<svg width="8px" height="8px" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="rotate(270)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.707540,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g> </svg>',
          previous:
            '<svg width="8px" height="8px" viewBox="0 -4.5 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" transform="rotate(90)"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <title>arrow_down [#338]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -6684.000000)"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.707540,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583" id="arrow_down-[#338]"> </path> </g> </g> </g> </g> </svg>',
        },
      },
      dom: "<'table-list-top'lp>" + 'tr',
      data,
      columns: [
        { data: '_id' },
        {
          data: 'imageCover',
          render: function (data, type, row) {
            return `
            <div class="table-photo">
              <a href="/tour/${row.slug}" target="_blank">
                <img src="/img/tours/thumb/${row.imageCover}" alt=""/>
              </a>
            </div>`;
          },
        },
        { data: 'name' },
        { data: 'summary' },
        // {
        //   data: 'name',
        //   render: function (data, type, row) {
        //     return `
        //   <div class="deneme">
        //     <span>${row.name}</span>
        //     <button class"button" data-id="${row._id}">Click<button>
        //   </div>`;
        //   },
        // },
        { data: 'duration' },
        { data: 'maxGroupSize' },
        { data: 'difficulty' },
        { data: 'price' },
        { data: 'durationWeeks' },
        { data: 'ratingsAverage' },
        { data: 'ratingsQuantity' },
        {
          data: 'active',
          orderData: 10,
          render: function (data, type, row) {
            return `
            <div class="w-full flex justify-center">
              <label class="toggle-switchy" for="active--${row._id}">
              <input class="active" id="active--${
                row._id
              }" type="checkbox" name="active" ${
                row.active ? 'checked' : ''
              } value="true" data-id="${row._id}">

                <span class="toggle">
                    <span class="switch"></span>
                </span>
              </label>
            </div>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `
            <div class="table-actions">
              <a class="table-actions__edit" href="${base}/product/edit/${row._id}"><svg><use xlink:href="/img/icons.svg#icon-edit"></use></svg></a>
              <a class="table-actions__delete" href="javascript:void(0)" data-id="${row._id}" data-type='delete'><svg><use xlink:href="/img/icons.svg#icon-delete"></use></svg></a>
            </div>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 10, // 10. sütun (active) için özel sıralama
          orderData: [10, 11], // Veriyi sıralarken kullanılacak sıralama dizini
          type: 'order-checkbox', // Checkbox sıralama tipi
        },
      ],
    });
  } catch (err) {
    console.error('Error:', err);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!table) return;
  await initializeDataTable();
  table.addEventListener('click', async function (e) {
    const deleteClicked = e.target.closest('.table-actions__delete');
    const switchyClicked = e.target.closest('.toggle-switchy');
    const td = e.target.closest('td');

    if (deleteClicked) {
      const rowId = deleteClicked.dataset.id;
      Swal.fire({
        title: 'Warning!',
        text: 'Are you sure you want to delete?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Yes',
        confirmButtonColor: colorSuccess,
        cancelButtonColor: colorDanger,
        reverseButtons: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.delete(
              `${BASE_URL}/api/v1/tours/${rowId}`,
            );
            dataTable.row(deleteClicked.closest('tr')).remove().draw();
            showAlert('success', 'Successfully Deleted');
          } catch (error) {
            console.log('error.response.data', error.response.data);
            showAlert('error', 'Deletion Failed');
          }
        }
      });
    }

    if (switchyClicked) {
      const statusButton = switchyClicked.querySelector('.active');
      statusButton.addEventListener('change', async function (e) {
        const data = { active: this.checked };
        const id = this.dataset.id;
        const res = await axios.patch(
          `${BASE_URL}/api/v1/tours/${id}`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        if (res.data.status === 'success') {
          showAlert('success', 'Status updated successfully!');
        }
      });
    }

    td.ondblclick = async function (e) {
      const td = this;
      // Eğer aria-disabled="false" yoksa yani edit edilemez ise

      const th = td
        .closest('table')
        .querySelector('th:nth-child(' + (td.cellIndex + 1) + ')');
      if (th.getAttribute('aria-disabled') !== 'false') return;
      const val = td.innerHTML;
      // if (isHTML(val)) return;

      const id = td.parentElement.querySelector('td:first-child').innerHTML;
      const name = th.dataset.name;
      const column = th.innerHTML;
      let html = '';
      let input = '';
      let editorValue = '';
      if (th.dataset.type == 'input') {
        td.innerHTML = '';
        html = `
          <div class="table-edit">
            <input value='${val}'>
            <button>Update</button>
          </div>`;
        td.insertAdjacentHTML('afterbegin', html);
        input = td.querySelector('input');
        input.focus();
      } else if (th.dataset.type == 'select') {
        const response = await axios.get(
          `${BASE_URL}/api/v1/difficulties`,
        );

        const optionsHTML = response.data.data
          .map((option) => {
            return `<option value="${option.level}" ${
              val === option.level ? 'selected' : ''
            }>${option.level}</option>`;
          })
          .join('');

        html = `
          <div class="table-edit">
              <select class="edit-select">
                  ${optionsHTML}
              </select>
              <button>Update</button>
          </div>`;
        td.innerHTML = '';
        td.insertAdjacentHTML('afterbegin', html);
        $('.edit-select').select2({ width: '100%' });
        input = td.querySelector('select');
      } else if (th.dataset.type == 'editor') {
        td.innerHTML = '';
        html = `
          <div class="table-edit">
            <div id="editor1" type="text"></div>
            <textarea class="editor1 hidden">${val}</textarea>
            <button>Update</button>
          </div>`;
        td.insertAdjacentHTML('afterbegin', html);
        // input = td.querySelector('input');
        // input.focus();

        let editor1;

        ClassicEditor.create(document.querySelector('#editor1'))
          .then((editor) => {
            editor1 = editor;
            const textarea = document.querySelector(
              'textarea.editor1',
            );
            editor.focus();
            editor.setData(decodeEntities(textarea.innerHTML));
            editor1.model.document.on('change:data', () => {
              const editorData = editor1.getData();
              // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
              const strippedText = editorData
                .replace(/(<([^>]+)>)/gi, '')
                .trim();
              editorValue = strippedText;
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }

      const tableEdit = td.querySelector('.table-edit');
      // Gölge
      document
        .querySelector('body')
        .insertAdjacentHTML('beforeend', '<div class="shadow"></div>');
      document.querySelector('tbody').classList.add('no-border');

      const shadow = document.querySelector('.shadow');
      setTimeout(() => {
        shadow.classList.add('show');
      }, 10);

      shadow.addEventListener('click', function (e) {
        setTimeout(() => {
          this.classList.remove('show');
          td.innerHTML = val;
          tableEdit.remove();
        }, 10);
        setTimeout(() => {
          this.remove();
        }, 200);
      });

      if (td.querySelector('input')) {
        td.querySelector('input').onclick = function (e) {
          e.stopPropagation(); // Tıklama olayının üst elemanlara ulaşmasını engelle
        };
      }
      if (td.querySelector('select')) {
        td.querySelector('select').onclick = function (e) {
          e.stopPropagation(); // Tıklama olayının üst elemanlara ulaşmasını engelle
        };
      }

      input.addEventListener('keydown', async function (e) {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent the default Enter key behavior (e.g., submitting a form)
          await handleUpdate();
        }
      });

      td.querySelector('button').addEventListener('click', async function (e) {
        await handleUpdate();
      });

      const handleUpdate = async function() {
        try {
          e.stopPropagation();
          let data = {};
          if(th.dataset.type == 'editor') {
            data = { [name]: editorValue };
          } else {
            data = { [name]: input.value };
          }
          const res = await axios.patch(
            `${BASE_URL}/api/v1/tours/${id}`,
            data,
            { headers: { 'Content-Type': 'multipart/form-data' } },
          );
          if (res.data.status === 'success') {
            setTimeout(() => {
              shadow.classList.remove('show');
              if(th.dataset.type == 'editor') {
                td.innerHTML = editorValue;
              } else {
                td.innerHTML = input.value;
              }
              tableEdit.remove();
            }, 10);
            setTimeout(() => {
              shadow.remove();
            }, 200);
            showAlert('success', `${column} updated successfully!`);
          }
        } catch (err) {
          if (err.response && err.response.data) {
            console.log('err.response.data', err.response.data);
            showAlert('error', err.response.data.message);
          } else {
            console.log('err', err);
            showAlert('error', 'An error occurred while adding the tour.');
          }
        }
      }
    };

    // table.querySelectorAll('tr td').forEach(function (node) {
    // Eski yöntem

    // node.ondblclick = async function (e) {

    // }
    // });
  });
});

createRangeSlider('.range-sliders__duration', 0, 1440);
createRangeSlider('.range-sliders__maxGroupSize', 0, 100);
createRangeSlider('.range-sliders__price', 0, 10000);
createRangeSlider('.range-sliders__durationWeeks', 0, 52);
createRangeSlider('.range-sliders__ratingsAverage', 0, 5);
createRangeSlider('.range-sliders__ratingsQuantity', 0, 10000);
