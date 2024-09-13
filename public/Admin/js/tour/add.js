/* eslint-disable */

///////////////////////////////////////////
// *** ADD

const wizard = document.querySelector('.wizard');

// There were empty spaces in textarea that cause a bug in validate.js
document.addEventListener('DOMContentLoaded', function () {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    textarea.value = textarea.value.trim();
  });
});

if (wizard) {
  const dataForm = document.querySelector('#dataForm');

  $('.wizard').steps({
    enableAllSteps: true,
    showFinishButtonAlways: true,
    headerTag: 'h3',
    bodyTag: '.content-container',
    transitionEffect: 'fade',
    labels: {
      cancel: 'Cancel',
      current: '',
      pagination: '',
      finish: 'Finish',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading...',
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      // Geçişlerde özel işlemler burada yapılabilir
      return true; // Geçiş izni vermek için true dönün
    },
    onFinished: function (event, currentIndex) {
      // Tamamlandığında yapılacak işlemler burada yapılabilir
      // Formu göndermek için form.submit() kullanılabilir

      if (dataForm) {
        const formData = new FormData(dataForm);
        const summary = editor1.getData();
        const description = editor2.getData();

        formData.delete('description', description);
        formData.delete('summary', summary);
        formData.append('description', description);
        formData.append('summary', summary);

        const checkbox = document.querySelector('#active');
        const checked = checkbox.checked;
        if (!checked) formData.append('active', 'false');
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        // if(true) return;
        const validated = handleFormSubmit(form);

        if (!validated) {
          showAlert('error', 'Please fill in the required fields.');
          return;
        }

        addTour(formData);
      }
    },
  });
}

// // These are the constraints used to validate the form
// const constraints2 = {
//   'name': {
//     presence: true,
//   },
//   'duration': {
//     presence: true,
//   },
//   'maxGroupSize': {
//     presence: true,
//   },
//   'difficulty': {
//     presence: true,
//   },
//   'price': {
//     presence: true,
//   },
//   'guides': {
//     presence: true,
//   },
//   'summary': {
//     presence: true,
//   },
//   'description': {
//     presence: true,
//   }
// };
// console.log(constraints2);

let constraints = {};

document
  .querySelectorAll('#dataForm [data-required="required"]')
  .forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    if (name) {
      constraints[name] = {
        presence: true,
      };
    }
  });

// console.log(constraints);

// Hook up the form so we can prevent it from being posted
const form = document.querySelector('#dataForm');
// form.addEventListener('submit', function (ev) {
//   ev.preventDefault();
//   handleFormSubmit(form);
// });

// Hook up the inputs to validate on the fly
// const inputs = document.querySelectorAll('input, textarea, select');
// for (const i = 0; i < inputs.length; ++i) {
//   inputs.item(i).addEventListener('keyup', function (ev, key) {
//     if (ev.key === 'Tab') {
//       console.log(key);
//       const errors = validate(form, constraints) || {};
//       showErrorsForInput(inputs.item(key), errors[this.name]);
//     } else {
//       const errors = validate(form, constraints) || {};
//       showErrorsForInput(this, errors[this.name]);
//     }
//   });
// }

document.addEventListener('DOMContentLoaded', function () {
  // let inputs = [
  //   ...document.querySelectorAll(
  //     '.input-text, .ck-editor, .select2-selection, a[role="menuitem"]',
  //   ),
  // ];
  // console.log('inputs', inputs);
  // inputs.forEach(function (input, key) {
  //   input.addEventListener('keydown', function (event) {
  //     // console.log(input);
  //     // console.log(this);
  //     // console.log('key', key);
  //     if (event.key === 'Shift') return;
  //     // yukardaki daha iyi
  //     // Sadece shift tuşuna basıldıysa. Shift+a, shift+t gibi durumlarda return etmesin
  //     // if (event.shiftKey && !event.key.match(/^[a-zA-Z0-9]$/)) return;
  //     if (event.key === 'Tab') {
  //       const errors = validate(form, constraints) || {};
  //       // console.log(errors);
  //       if (this.classList.contains('ck-editor')) {
  //         const textArea = this.nextElementSibling;
  //         showErrorsForInput(textArea, errors[textArea.name]);
  //       } else if (this.classList.contains('select2-selection--single')) {
  //         const selectList =
  //           this.closest('.content-box').querySelector('.select-list');
  //         showErrorsForInput(selectList, errors[selectList.name]);
  //       } else if (this.classList.contains('select2-selection--multiple')) {
  //         const selectList = this.closest('.content-box').querySelector(
  //           '.select-list-multiple',
  //         );
  //         showErrorsForInput(selectList, errors[selectList.name]);
  //       } else {
  //         showErrorsForInput(this, errors[this.name]);
  //       }
  //     } else {
  //       // keydown ile input'a ilk harfi girdiğimde input boş bırakılamaz uyarısı oluyordu. Düzeltmek için settimeout kullanıldı.
  //       setTimeout(() => {
  //         const errors = validate(form, constraints) || {};
  //         if (this.classList.contains('ck-editor')) {
  //           const textArea = this.nextElementSibling;
  //           showErrorsForInput(textArea, errors[textArea.name]);
  //         } else {
  //           showErrorsForInput(this, errors[this.name]);
  //         }
  //       }, 100);
  //     }
  //   });
  // });

  // $('.select-list').on('select2:select', function (e) {
  //   const errors = validate(form, constraints) || {};
  //   showErrorsForInput(this, errors[this.name]);
  // });

  // $('.select-list-multiple').on('select2:select', function (e) {
  //   const errors = validate(form, constraints) || {};
  //   showErrorsForInput(this, errors[this.name]);
  // });

  // flatpickr('.datepicker', {
  //   onChange: function (selectedDates, dateStr, instance) {
  //     const errors = validate(form, constraints) || {};
  //     // console.log(instance.element);
  //     showErrorsForInput(instance.element, errors[instance.element.name]);
  //   },
  // });

  function addToInputs() {
    // inputs = [];

    const newInputs = document.querySelectorAll(
      '.input-text, .ck-editor, .select2-selection, .input-img, a[role="menuitem"]',
    );

    newInputs.forEach(function (input, key) {
      input.addEventListener('keydown', function (event) {
        // console.log(input);
        // console.log(this);
        // console.log('key', key);
        if (event.key === 'Shift') return;
        // yukardaki daha iyi
        // Sadece shift tuşuna basıldıysa. Shift+a, shift+t gibi durumlarda return etmesin
        // if (event.shiftKey && !event.key.match(/^[a-zA-Z0-9]$/)) return;
        if (event.key === 'Tab') {
          const errors = validate(form, constraints) || {};
          // console.log(errors);
          if (this.classList.contains('ck-editor')) {
            const textArea = this.nextElementSibling;
            showErrorsForInput(textArea, errors[textArea.name]);
          } else if (this.classList.contains('select2-selection--single')) {
            const selectList =
              this.closest('.content-box').querySelector('.select-list');
            showErrorsForInput(selectList, errors[selectList.name]);
          } else if (this.classList.contains('select2-selection--multiple')) {
            const selectList = this.closest('.content-box').querySelector(
              '.select-list-multiple',
            );
            showErrorsForInput(selectList, errors[selectList.name]);
          } else {
            showErrorsForInput(this, errors[this.name]);
          }
        } else {
          // keydown ile input'a ilk harfi girdiğimde input boş bırakılamaz uyarısı oluyordu. Düzeltmek için settimeout kullanıldı.
          setTimeout(() => {
            const errors = validate(form, constraints) || {};
            if (this.classList.contains('ck-editor')) {
              const textArea = this.nextElementSibling;
              showErrorsForInput(textArea, errors[textArea.name]);
            } else {
              showErrorsForInput(this, errors[this.name]);
            }
          }, 100);
        }
      });
    });

    $('.select-list').on('select2:select', function (e) {
      const errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name]);
    });

    $('.select-list-multiple').on('select2:select', function (e) {
      const errors = validate(form, constraints) || {};
      showErrorsForInput(this, errors[this.name]);
    });

    flatpickr('.datepicker', {
      onChange: function (selectedDates, dateStr, instance) {
        const errors = validate(form, constraints) || {};
        // console.log(instance.element);
        showErrorsForInput(instance.element, errors[instance.element.name]);
      },
    });

    // inputs.push(...newInputs);
    // console.log('new inputs', newInputs);
  }
  addToInputs();

  const addLocationBtn = document.querySelector('.add-btn__location');
  const addDateBtn = document.querySelector('.add-btn__date');

  if (addLocationBtn) {
    let locationCounter = 2;
    let locationIndex = 1;

    addLocationBtn.addEventListener('click', function (e) {
      const locationBoxHTML = `
        <div class="location-divider">
          <div class="location-counter">${locationCounter}</div>
          <div class="content-border"></div>
        </div>
        <div class="content-inner location-box pl-2">
          <div class="content-box w-1/2">
              <label for="locations[${locationIndex}][coordinates][0]">Latitude</label>
              <div class="input-box">
                <input type="text" class="input-text" id="locations[${locationIndex}][coordinates][0]" name="locations[${locationIndex}][coordinates][0]" data-required="required">
              </div>
          </div>
          <div class="content-box w-1/2">
              <label for="locations[${locationIndex}][coordinates][1]">Longitude</label>
              <div class="input-box">
                <input type="text" class="input-text" id="locations[${locationIndex}][coordinates][1]" name="locations[${locationIndex}][coordinates][1]" data-required="required">
              </div>
          </div>
          <div class="content-box w-full">
              <label for="locations[${locationIndex}][description]">Location Description</label>
              <div class="input-box">
                <input type="text" class="input-text" id="locations[${locationIndex}][description]" name="locations[${locationIndex}][description]" data-required="required">
              </div>
          </div>
          <div class="content-box w-full">
              <label for="locations[${locationIndex}][address]">Location Address</label>
              <div class="input-box">
                <input type="text" class="input-text" id="locations[${locationIndex}][address]" name="locations[${locationIndex}][address]" data-required="required">
              </div>
          </div>
          <div class="content-box w-full">
              <label for="locations[${locationIndex}][day]">Location Day</label>
              <div class="input-box">
                <input type="text" class="input-text" id="locations[${locationIndex}][day]" name="locations[${locationIndex}][day]" data-required="required">
              </div>
          </div>
        </div>
      `;

      const locationBoxes = document.querySelectorAll('.location-box');
      const lastlocationBox = locationBoxes[locationBoxes.length - 1];
      lastlocationBox.insertAdjacentHTML('afterend', locationBoxHTML);

      // Her seferinde locationCounter ve locationIndex'i güncelleyin
      locationCounter++;
      locationIndex++;

      addToInputs();
      updateConstraints();
    });
  }

  if (addDateBtn) {
    let dateCounter = 2;
    let dateIndex = 1;

    addDateBtn.addEventListener('click', function (e) {
      const dateBoxHTML = `
        <div class="content-inner date-box relative">
          <div class="date-box__line ml-2"></div>
          <div class="content-box relative ml-3 w-1/3">
            <div class="date-box__dot"></div>
            <label for="startDates[${dateIndex}]">${dateCounter}. Start Date </label>
            <div class="input-box">
              <input class="input-text datepicker" type="text" id="startDates[${dateIndex}]" name="startDates[${dateIndex}]" data-required="required">
            </div>
          </div>
        </div>
      `;

      const dateBoxes = document.querySelectorAll('.date-box');
      const lastdateBox = dateBoxes[dateBoxes.length - 1];
      lastdateBox.insertAdjacentHTML('afterend', dateBoxHTML);

      const newDatepicker =
        lastdateBox.nextElementSibling.querySelector('.datepicker');
      flatpickr(newDatepicker, {
        onChange: function (selectedDates, dateStr, instance) {
          const errors = validate(form, constraints) || {};
          showErrorsForInput(instance.element, errors[instance.element.name]);
        },
      });
      dateCounter++;
      dateIndex++;

      addToInputs();
      updateConstraints();
    });
  }
});

function handleFormSubmit(form, input) {
  // validate the form against the constraints
  const errors = validate(form, constraints, { format: 'detailed' });
  // const errors = validate(form, constraints);
  // console.log(errors);
  // then we update the form to reflect the results
  showErrors(form, errors || {});
  if (!errors) {
    return true;
  } else {
    console.log(errors);
    const firstError = errors[0]; // errors dizisindeki ilk nesne
    const attributeName = firstError.attribute; // ilk nesnenin "attribute" özelliği
    const element = document
      .querySelector(`[name='${attributeName}']`)
      .closest('.content-container');
    const contentContainers = Array.from(
      document.querySelectorAll('.content-container'),
    );
    const index = contentContainers.indexOf(element);
    $(`#steps-uid-0-t-${index}`).get(0).click();
    return false;
  }
}

// Updates the inputs with the validation errors
function showErrors(form, errors) {
  // We loop through all the inputs and show the errors for that input
  const inputs = form.querySelectorAll(
    '.input-text[name], select[name], textarea[name], .input-img[name]',
  );
  inputs.forEach((input) => {
    // console.log('------------------------------------------');
    // console.log(errors);
    // console.log(input.name);
    // console.log(input.name);
    // console.log(errors[input.name]);
    // console.log(errors && errors[input.name]);
    // console.log('------------------------------------------');
    // 'attribute' değeri 'name' olan nesnenin 'error' alanına erişmek
    if (Object.keys(errors).length === 0) return;
    var nameError = errors.find((error) => {
      if (error.attribute === input.name) return error.error;
    });
    showErrorsForInput(input, nameError);
    // showErrorsForInput(input, errors && errors[input.name]);
  });
}

// Shows the errors for a specific input
function showErrorsForInput(input, errors) {
  // This is the root of the input
  // console.log(input);
  // console.log(errors);

  if (input.getAttribute('role') === 'menuitem') return;
  const formGroup = closestParent(input.parentNode, 'content-box');
  // Find where the error messages will be insert into
  // const messages = formGroup.querySelector('.messages');
  // First we remove any old messages and resets the classes
  resetFormGroup(formGroup);
  // console.log(formGroup);
  // If we have errors

  if (errors) {
    // we first mark the group has having errors
    formGroup.classList.add('has-error');
    if (formGroup.querySelector('.input-text')) {
      formGroup.querySelector('.input-text').classList.remove('border-success');
      formGroup.querySelector('.input-text').classList.add('border-danger');
      if (formGroup.querySelector('.input-svg')) {
        formGroup.querySelector('.input-svg').remove();
        const inputIcon = `<svg class='input-svg input-svg--error'><use xlink:href='/img/icons.svg#icon-cross'></use></svg>`;
        formGroup
          .querySelector('.input-text')
          .insertAdjacentHTML('afterend', inputIcon);
      } else {
        const inputIcon = `<svg class='input-svg input-svg--error'><use xlink:href='/img/icons.svg#icon-cross'></use></svg>`;
        formGroup
          .querySelector('.input-text')
          .insertAdjacentHTML('afterend', inputIcon);
      }
    }
    if (formGroup.querySelector('.select2')) {
      formGroup.querySelector('.select2').classList.remove('border-success');
      formGroup.querySelector('.select2').classList.add('border-danger');
    }
    if (formGroup.querySelector('.ck-editor__main')) {
      formGroup
        .querySelector('.ck-editor__main')
        .classList.remove('border-success');
      formGroup
        .querySelector('.ck-editor__main')
        .classList.add('border-danger');
    }
    if (formGroup.querySelector('.image-box')) {
      formGroup
        .querySelector('.image-box')
        .classList.remove('border-success-dashed');
      formGroup
        .querySelector('.image-box')
        .classList.add('border-danger-dashed');
      formGroup
        .querySelector('.image-upload')
        .classList.remove('image-upload--success');
      formGroup
        .querySelector('.image-upload')
        .classList.add('image-upload--danger');
    }
    // then we append all the errors
    // errors.forEach((error) => {
    //   addError(messages, error);
    // });
  } else {
    // otherwise we simply mark it as success
    formGroup.classList.add('has-success');
    if (formGroup.querySelector('.input-text')) {
      formGroup.querySelector('.input-text').classList.remove('border-danger');
      formGroup.querySelector('.input-text').classList.add('border-success');
      if (formGroup.querySelector('.input-svg')) {
        formGroup.querySelector('.input-svg').remove();
        const inputIcon = `<svg class='input-svg input-svg--success'><use xlink:href='/img/icons.svg#icon-check'></use></svg>`;
        formGroup
          .querySelector('.input-text')
          .insertAdjacentHTML('afterend', inputIcon);
      } else {
        const inputIcon = `<svg class='input-svg input-svg--success'><use xlink:href='/img/icons.svg#icon-check'></use></svg>`;
        formGroup
          .querySelector('.input-text')
          .insertAdjacentHTML('afterend', inputIcon);
      }
    }
    if (formGroup.querySelector('.select2')) {
      formGroup.querySelector('.select2').classList.remove('border-danger');
      formGroup.querySelector('.select2').classList.add('border-success');
    }
    if (formGroup.querySelector('.ck-editor__main')) {
      formGroup
        .querySelector('.ck-editor__main')
        .classList.remove('border-danger');
      formGroup
        .querySelector('.ck-editor__main')
        .classList.add('border-success');
    }
    if (formGroup.querySelector('.image-box')) {
      formGroup
        .querySelector('.image-box')
        .classList.remove('border-danger-dashed');
      formGroup
        .querySelector('.image-box')
        .classList.add('border-success-dashed');
      formGroup
        .querySelector('.image-upload')
        .classList.remove('image-upload--danger');
      formGroup
        .querySelector('.image-upload')
        .classList.add('image-upload--success');
    }
  }
}

// Recusively finds the closest parent that has the specified class
function closestParent(child, className) {
  if (!child || child == document) {
    return null;
  }
  if (child.classList.contains(className)) {
    return child;
  } else {
    return closestParent(child.parentNode, className);
  }
}

function resetFormGroup(formGroup) {
  // Remove the success and error classes
  formGroup.classList.remove('has-error');
  formGroup.classList.remove('has-success');
  // and remove any old messages
  const helpBlocks = formGroup.querySelectorAll('.help-block.error');
  helpBlocks.forEach((el) => {
    el.parentNode.removeChild(el);
  });
  // _.each(formGroup.querySelectorAll('.help-block.error'), function (el) {
  //   el.parentNode.removeChild(el);
  // });
}

// Adds the specified error with the following markup
// <p class="help-block error">[message]</p>
function addError(messages, error) {
  const block = document.createElement('p');
  block.classList.add('help-block');
  block.classList.add('error');
  block.innerText = error;
  messages.appendChild(block);
}

///////////////////////////////////////////
// *** INSERTIONS TO DOM

// document.addEventListener('DOMContentLoaded', function () {

// });

function checkDataLength(value, maxLength, inputName, type) {
  // console.log(inputName);
  // console.log(value.length);
  // console.log("------------------");
  if (value.length > maxLength) {
    if (type == 'file') {
      showAlert(
        'error',
        `${inputName} is too many (maximum size: ${maxLength} files).`,
      );
    } else {
      showAlert(
        'error',
        `${inputName} is too long (maximum length: ${maxLength} characters).`,
      );
    }
    return true; // Eğer bir hata constsa true döndür
  }
  return false; // Eğer bir hata yoksa false döndür
}

const addTour = async (data) => {
  try {
    const inputs = document.querySelectorAll('input[data-length]');
    let hasError = false; // Hata kontrolü için

    // console.log(inputs);
    for (const input of inputs) {
      const name = input.getAttribute('name');
      const label = document.querySelector(`label[for="${name}"]`);
      const labelText = label.textContent.trim();
      const maxLen = parseInt(input.getAttribute('data-length'), 10);
      let value;
      let type;
      // multiple inputlar için getAll olmalı yoksa çalışmaz
      if (input.hasAttribute('multiple')) {
        type = 'file';
        value = data.getAll(name);
      } else {
        type = 'notFile';
        value = data.get(name);
      }
      // console.log(name, text, maxLen, value);
      if (checkDataLength(value, maxLen, labelText, type)) {
        hasError = true;
      }
    }

    if (hasError) return; // Hata constsa işlemi sonlandır. Bu olmasa post işlemi gerçekleşir ver veriler null olduğu için 500 hatası verirdi.

    const url = `${BASE_URL}/api/v1/tours`;

    const res = await axios({
      method: 'POST',
      url,
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour added successfully!');
      setTimeout(() => {
        location.reload();
      }, 500);
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
};

// const validateName = (name) => {
//   if (name.length > 27) {
//     showAlert('error', 'Name is too long');
//     return false;
//   }
//   return true;
// };

// const validateImages = (images) => {
//   if (images.length > 3) {
//     showAlert('error', 'En fazla 3 resim yükleyebilirsiniz.');
//     return false;
//   }
//   return true;
// };

// const addTour = async (data) => {
//   const name = data.get('name');
//   const images = data.getAll('images');
//   console.log(images.length);
//   if (validateName(name) && validateImages(images)) {
//     try {
//       const url = `${BASE_URL}/api/v1/tours`;

//       const res = await axios({
//         method: 'POST',
//         url,
//         data,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (res.data.status === 'success') {
//         showAlert('success', 'Tour added successfully!');
//       }
//     } catch (err) {
//       if (typeof showAlert === 'function') {
//         showAlert('error', err.response.data.message);
//       } else {
//         console.error(err);
//       }
//     }
//   }
// };

const imageUpload = function (imageInput, imageBox, key) {
  const previewContainer = document.querySelector(`.preview-container--${key}`);
  const imageUpload = imageBox.querySelector('.image-upload');
  const errors = validate(form, constraints) || {};

  imageInput.addEventListener('click', function (e) {
    imageBox.classList.add('image-box--focus');
    document.body.onfocus = ifCanceled;

    function ifCanceled() {
      if (imageInput.value.length == 0) {
        imageBox.classList.remove('image-box--focus');

        if (errors[imageInput.name]) {
          imageBox.classList.remove('border-success-dashed');
          imageUpload.classList.remove('image-upload--success');
          imageBox.classList.add('border-danger-dashed');
          imageUpload.classList.add('image-upload--danger');
        } else {
          imageBox.classList.add('border-success-dashed');
          imageUpload.classList.add('image-upload--success');
        }
      }

      document.body.onfocus = null;
    }
  });

  // if (errors[this.name]) {
  //   imageBox.classList.remove('border-success-dashed');
  //   imageUpload.classList.remove('image-upload--success');
  //   imageBox.classList.add('border-danger-dashed');
  //   imageUpload.classList.add('image-upload--danger');
  // }
  imageInput.addEventListener('change', async (e) => {
    const selectedFiles = e.target.files;
    previewContainer.classList.remove('hidden');
    // Önce önizleme konteynerini temizleyin
    previewContainer.innerHTML = '';
    // console.log(selectedFiles);
    // Her seçilen dosya için yeni bir önizleme oluşturun
    for (let i = 0; i < selectedFiles.length; i++) {
      // console.log(selectedFiles.length);
      // if (selectedFiles.length > 0) {
      //   imageBox.style.border = '2px dashed #3ebf6e';
      //   imageUpload.style.fill = '#3ebf6e';
      // }

      if (selectedFiles.length > 0) {
        imageBox.closest('.content-box').classList.add('has-success');
        imageBox.classList.add('border-success-dashed');
        imageUpload.classList.add('image-upload--success');
      }

      const file = selectedFiles[i];
      if (file.type.startsWith('image/')) {
        // Resim dosyası ise
        const img = new Image();
        img.src = URL.createObjectURL(file);

        // Genişlik ve yüksekliği beklemek için bir Promise gerekiyor çünkü resim yükleme asenkron bir işlem.
        // Onload kullanılmadan görselin witdh ve height'ına ulaşılamaz

        const getDimensions = new Promise((resolve) => {
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
        });

        const { width, height } = await getDimensions;

        // data-pswp-width ve data-pswp-height olmadan photoswipe çalışmaz
        const previewHTML = `
          <li class="preview-list">
            <a class="preview-gallery" href="${URL.createObjectURL(
              file,
            )}" data-pswp-width="${width}" data-pswp-height="${height}" tabindex="-1">
              <img src="${URL.createObjectURL(file)}">
              <div class="preview-img-options">
                <ul>
                  <li class="preview-zoom-in">
                    <svg>
                      <use xlink:href='/img/icons.svg#icon-zoom-in'/>
                    </svg>
                  </li>
                  <li class="preview-delete">
                    <svg>
                      <use xlink:href='/img/icons.svg#icon-delete'/>
                    </svg>
                  </li>
                </ul>
              </div>
            </a>
          </li>
        `;

        previewContainer.insertAdjacentHTML('beforeend', previewHTML);

        const lightbox = new PhotoSwipeLightbox({
          gallery: `.preview-container--${key}`,
          children: 'a',
          showHideAnimationType: 'fade',
          pswpModule: PhotoSwipe,
          wheelToZoom: true,
        });
        lightbox.init();

        const deleteButtons = document.querySelectorAll('.preview-delete');
        deleteButtons.forEach((deleteButton) => {
          deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation(); // Parent öğe (link) üzerinde tıklamayı engellemek için gerekli

            // Önce önizlemeyi kaldır
            // const previewList = deleteButton.closest('.preview-list');
            // const previewLists = document.querySelectorAll('.preview-list');
            // const index = Array.from(previewLists).indexOf(previewList);
            // console.log(index);

            const previewList = deleteButton.closest('.preview-list');
            // console.log('------------------------------------');
            // console.log(previewList);
            // console.log(previewList.parentElement);
            // console.log(previewList.parentElement.children);
            // console.log('------------------------------------');
            const index = Array.from(
              previewList.parentElement.children,
            ).indexOf(previewList);
            // console.log("index", index);
            // İlgili dosyayı seçimden kaldır
            const imageInput = document.querySelector(`.input--${key}`);
            const selectedFiles = Array.from(imageInput.files);
            selectedFiles.splice(index, 1); // Seçili dosyayı diziden kaldır
            console.log(selectedFiles.length);
            if (selectedFiles.length === 0) {
              // imageBox.style.border = '2px dashed #d3d6db';
              // imageUpload.style.fill = '#d3d6db';
              if (errors[imageInput.name]) {
                imageBox.classList.remove('border-success-dashed');
                imageUpload.classList.remove('image-upload--success');
                imageBox.classList.add('border-danger-dashed');
                imageUpload.classList.add('image-upload--danger');
              }
              previewContainer.classList.add('hidden');
            } else {
              // imageBox.style.border = '2px dashed #3ebf6e';
              // imageUpload.style.fill = '#3ebf6e';
              imageBox.classList.add('border-success-dashed');
              imageUpload.classList.add('image-upload--success');
            }
            // Dosyaları yeniden atama
            const newFileList = new DataTransfer();
            for (const file of selectedFiles) {
              newFileList.items.add(file);
            }
            imageInput.files = newFileList.files;
            // console.log(imageInput.files);

            previewList.remove();

            // // previewContainer.classList.add('hidden');
            // // Ardından, ilişkili dosyanın seçimini iptal etmek için input alanını sıfırla
            // const imageCoverInput = document.querySelector(`.input--${key}`);
            // imageCoverInput.value = ''; // Dosya seçimini iptal eder
          });
        });
      } else if (file.type === 'application/pdf') {
        // PDF dosyası ise
        const previewHTML = `
          <embed class="preview-pdf" src="${URL.createObjectURL(file)}">
        `;

        previewContainer.insertAdjacentHTML('beforeend', previewHTML);
      }
    }
  });
};

// const imageBoxes = document.querySelectorAll('.image-box');
const imageBoxFirst = document.querySelector('.image-box--1');
const imageCoverInput = document.querySelector('#imageCover');
const imageBoxSecond = document.querySelector('.image-box--2');
const imagesInput = document.querySelector('#images');

imageBoxFirst.addEventListener('click', () => {
  imageCoverInput.click();
});

imageUpload(imageCoverInput, imageBoxFirst, 1);

imageBoxSecond.addEventListener('click', () => {
  imagesInput.click();
});
imageUpload(imagesInput, imageBoxSecond, 2);

// imageBox.addEventListener('click', () => {
//   imagesInput.click();
// });

// imageBox.addEventListener('click', (e) => {
//   console.log(e.target);
//   imageCoverInput.click();
// });

// imageCoverInput.addEventListener('change', (e) => {
//   const selectedFiles = e.target.files;
//   previewContainer.classList.remove('hidden');

//   // Her seçilen dosya için yeni bir önizleme oluşturun
//   for (let i = 0; i < selectedFiles.length; i++) {
//     const file = selectedFiles[i];

//     if (file.type.startsWith('image/')) {
//       // Resim dosyası ise
//       const previewLink = document.createElement('a');
//       const previewImage = document.createElement('img');

//       previewLink.classList.add('preview-gallery');
//       previewLink.href = URL.createObjectURL(file);

//       // Resmin genişliğini ve yüksekliğini almak için bir Image nesnesi kullanın
//       const img = new Image();
//       img.src = URL.createObjectURL(file);

//       img.onload = () => {
//         const imgWidth = img.width; // Resmin genişliği
//         const imgHeight = img.height; // Resmin yüksekliği

//         // data-pswp-width ve data-pswp-height özniteliklerini ekleyin
//         previewLink.setAttribute('data-pswp-width', imgWidth);
//         previewLink.setAttribute('data-pswp-height', imgHeight);

//         previewImage.src = URL.createObjectURL(file);
//         previewLink.appendChild(previewImage);

//         // <ul class="preview-container"> içine ekleyin
//         document.querySelector('.preview-container').appendChild(previewLink);
//       };
//     } else if (file.type === 'application/pdf') {
//       // PDF dosyası ise
//       const previewPDF = document.createElement('embed');

//       previewPDF.classList.add('preview-pdf');
//       previewPDF.src = URL.createObjectURL(file);

//       // <ul class="preview-container"> içine ekleyin
//       document.querySelector('.preview-container').appendChild(previewPDF);
//     }
//   }
// });

$('.select-list').select2({
  width: '100%',
});

$('.select-list-multiple').select2({
  width: '100%',
});

// // const elements = document.querySelectorAll('input, a[href="#next"][role="menuitem"]');
// const elements = document.querySelectorAll('.input-text, .ck-editor__main, .select2-selection', 'a[href="#next"]');
// console.log(elements);

//////////////////////////////////////
// *** CK EDITOR

let editor1;
let editor2;

ClassicEditor.create(document.querySelector('#editor1'))
  .then((editor) => {
    editor1 = editor;
    document
      .querySelector('label[for=editor1')
      .addEventListener('click', function () {
        editor.focus();
      });
    editor1.model.document.on('change:data', () => {
      const editorData = editor1.getData();
      // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
      const textarea = document.querySelector(
        'textarea.editor1',
      );
      const strippedText = editorData.replace(/(<([^>]+)>)/gi, '').trim();
      textarea.value = strippedText;
    });
  })
  .catch((error) => {
    console.error(error);
  });

ClassicEditor.create(document.querySelector('#editor2'))
  .then((editor) => {
    editor2 = editor;
    document
      .querySelector('label[for=editor2')
      .addEventListener('click', function () {
        editor.focus();
      });
    editor2.model.document.on('change:data', () => {
      const editorData = editor2.getData();
      // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
      const textarea = document.querySelector(
        'textarea.editor2',
      );
      const strippedText = editorData.replace(/(<([^>]+)>)/gi, '').trim();
      textarea.value = strippedText;
    });
  })
  .catch((error) => {
    console.error(error);
  });
