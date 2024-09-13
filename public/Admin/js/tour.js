// /* eslint-disable */

// import axios from 'axios';
// import { showAlert } from './alerts';

// export const addTour = async (data) => {
//   try {
//     const url = `http://127.0.0.1:3000/api/v1/tours`;

//     const res = await axios({
//       method: 'POST',
//       url,
//       data,
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `Tour added successfully!`);
//     }
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err.response.data.message);
//   }
// };

// export const updateTour = async (data, id) => {
//   try {
//     const url = `http://127.0.0.1:3000/api/v1/tours/${id}`;

//     const res = await axios({
//       method: 'PATCH',
//       url,
//       data,
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `Tour updated successfully!`);
//     }
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err.response.data.message);
//   }
// };
