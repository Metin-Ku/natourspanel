/* eslint-disable */

// import axios from 'axios';
// import { showAlert } from './alerts';

///////////////////////////////////////////
// LIST

const table = document.querySelector('#dataTable');

let dataTable;

const initializeDataTable = async function () {
  try {
    const fields = createFields();
    const url = `${BASE_URL}/api/v1/users?fields=${fields}`;

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
          data: null,
          render: function (data, type, row) {
            return `
            <div class="table-photo">
              <a href="javascript:void(0)">
                <img src="/img/users/thumb/${row.photo}" alt=""/>
              </a>
            </div>`;
          },
        },
        { data: 'email' },
        { data: 'name' },
        { data: 'role' },
        {
          data: 'active',
          orderData: 5,
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
              <a class="table-actions__edit" href="${base}/user/edit/${row._id}"><svg><use xlink:href="/img/icons.svg#icon-edit"></use></svg></a>
              <a class="table-actions__delete" href="javascript:void(0)" data-id="${row._id}" data-type='delete'><svg><use xlink:href="/img/icons.svg#icon-delete"></use></svg></a>
            </div>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 5, // 5. sütun (active) için özel sıralama
          orderData: [5, 6], // Veriyi sıralarken kullanılacak sıralama dizini
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

    if (deleteClicked) {
      const rowId = clicked.dataset.id;

      Swal.fire({
        title: 'Warning!',
        text: 'Are you sure you want to do delete?',
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
              `${BASE_URL}/api/v1/users/${rowId}`,
            );

            dataTable.row(clicked.closest('tr')).remove().draw();

            showAlert('success', 'Successfully Deleted');
          } catch (error) {
            console.error(error);
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
          `${BASE_URL}/api/v1/users/${id}`,
          data,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        if (res.data.status === 'success') {
          showAlert('success', 'Status updated successfully!');
        }
      });
    }
  });
});
