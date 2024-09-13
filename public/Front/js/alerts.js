/* eslint-disable */

// type is 'success' or 'error'

// export const hideAlert = () => {
//   // const el = document.querySelector('.alert');
//   // if (el) el.parentElement.removeChild(el);
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// export const showAlert = (type, msg) => {
//   // hideAlert();
//   // const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   // document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//   // window.setTimeout(hideAlert, 5000);
//   // hideAlert();

//   // hideAlert();
//   const markup = `<div class="alert"></div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//   const alert = document.querySelector('.alert');
//   alert.classList.add(`alert--${type}`);
//   alert.classList.add('alert-show');
//   alert.textContent = msg;
//   window.setTimeout(hideAlert, 3000);
// };

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) {
    el.style.top = '-100%'; // Geçiş efekti için top değerini değiştir
    setTimeout(() => {
      el.parentElement.removeChild(el);
    }, 100); // Geçiş süresine uygun bir süre bekletme
  }
};

export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert"></div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  const alert = document.querySelector('.alert');
  alert.classList.add(`alert--${type}`);
  alert.textContent = msg;

  // Geçiş efektini başlat
  setTimeout(() => {
    alert.classList.add('alert-show');
  }, 100);

  window.setTimeout(hideAlert, 2000);
};
