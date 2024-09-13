/* eslint-disable */

///////////////////////////////////////////
// *** ADD

const wizard = document.querySelector('.wizard');
const dataForm = document.querySelector('#dataForm');
const id = dataForm.dataset.id;

// There were empty spaces in textarea that cause a bug in validate.js
document.addEventListener('DOMContentLoaded', function () {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach((textarea) => {
    textarea.value = textarea.value.trim();
  });
});

if (wizard) {
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

        // If there is no image remove it from formData so image limit size works properly
        if (formData.has('images')) {
          const images = formData.get('images');
          if (images.size === 0) {
            formData.delete('images');
          }
        }
        const inputImages = document.querySelectorAll('.multiple');
        inputImages.forEach((inputImage, key) => {
          if (
            inputImage.dataset.value !== null &&
            inputImage.dataset.value !== ''
          ) {
            const presentImages = inputImage.dataset.value.split(',');
            presentImages.forEach((presentImage) => {
              formData.append(inputImage.dataset.name, presentImage);
            });
          }
        });
        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        // if (true) return;
        const validated = handleFormSubmit(form);

        if (!validated) {
          showAlert('error', 'Please fill in the required fields.');
          return;
        }

        updateTour(formData, id);
      }
    },
  });
}

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

function updateConstraints() {
  const updatedConstraints = {};

  document
    .querySelectorAll('#dataForm [data-required="required"]')
    .forEach((inputElement) => {
      const name = inputElement.getAttribute('name');
      if (name) {
        updatedConstraints[name] = {
          presence: true,
        };
      }
    });

  // constraints nesnesini güncelle
  constraints = updatedConstraints;
}

// Hook up the form so we can prevent it from being posted
const form = document.querySelector('#dataForm');

document.addEventListener('DOMContentLoaded', function () {
  function addToInputs() {
    // inputs = [];

    const newInputs = document.querySelectorAll(
      '.input-text, .ck-editor, .select2-selection, .input-img, a[role="menuitem"]',
    );

    newInputs.forEach(function (input, key) {
      input.addEventListener('keydown', function (event) {
        if (event.key === 'Shift') return;
        // yukardaki daha iyi
        // Sadece shift tuşuna basıldıysa. Shift+a, shift+t gibi durumlarda return etmesin
        // if (event.shiftKey && !event.key.match(/^[a-zA-Z0-9]$/)) return;
        if (event.key === 'Tab') {
          const errors = validate(form, constraints) || {};
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
        showErrorsForInput(instance.element, errors[instance.element.name]);
      },
    });
  }
  addToInputs();

  const addLocationBtn = document.querySelector('.add-btn__location');
  const addDateBtn = document.querySelector('.add-btn__date');

  if (addLocationBtn) {
    let locationCounter =
      document.querySelectorAll('.location-counter').length + 1;
    let locationIndex = document.querySelectorAll('.location-counter').length;

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
    let dateCounter = document.querySelectorAll('.date-box').length + 1;
    let dateIndex = document.querySelectorAll('.date-box').length;

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
  // const errors = validate(form, constraints);
  const errors = validate(form, constraints, { format: 'detailed' });
  // then we update the form to reflect the results
  console.log(errors);

  const imageBoxes = document.querySelectorAll('.image-box');
  imageBoxes.forEach((imageBox) => {
    if (imageBox.dataset.value) {
      const inputImg = imageBox.querySelector('.input-img');
      const indexToRemove = errors.findIndex(
        (item) => item.attribute === inputImg.name,
      );
      if (indexToRemove !== -1) errors.splice(indexToRemove, 1);
    }
  });

  showErrors(form, errors || {});
  if (!errors || errors.length === 0) {
    return true;
  } else {
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
    if (Object.keys(errors).length === 0) return;
    var nameError = errors.find((error) => {
      if (error.attribute === input.name) return error.error;
    });
    showErrorsForInput(input, nameError);
  });
}

// Shows the errors for a specific input
function showErrorsForInput(input, errors) {
  // This is the root of the input

  if (input.getAttribute('role') === 'menuitem') return;
  const formGroup = closestParent(input.parentNode, 'content-box');
  // Find where the error messages will be insert into
  // const messages = formGroup.querySelector('.messages');
  // First we remove any old messages and resets the classes
  resetFormGroup(formGroup);
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

const updateTour = async (data, id) => {
  try {
    const inputs = document.querySelectorAll('input[data-length]');
    let hasError = false; // Hata kontrolü için
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
      if (checkDataLength(value, maxLen, labelText, type)) {
        hasError = true;
      }
    }

    if (hasError) return; // Hata constsa işlemi sonlandır. Bu olmasa post işlemi gerçekleşir ver veriler null olduğu için 500 hatası verirdi.

    const url = `${BASE_URL}/api/v1/tours/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Tour updated successfully!');
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
      showAlert('error', 'An error occurred while updating the tour.');
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

document.addEventListener('DOMContentLoaded', function () {
  const previewContainerFirst = document.querySelector('.preview-container--1');
  if (previewContainerFirst) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '.preview-container--1',
      children: 'a',
      showHideAnimationType: 'fade',
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
    });
    lightbox.init();
  }

  const previewContainerSecond = document.querySelector(
    '.preview-container--2',
  );
  if (previewContainerSecond) {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '.preview-container--2',
      children: 'a',
      showHideAnimationType: 'fade',
      pswpModule: PhotoSwipe,
      wheelToZoom: true,
    });
    lightbox.init();
  }

  const imageUpload = function (imageInput, imageBox, key) {
    const previewContainer = document.querySelector(
      `.preview-container--${key}`,
    );
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

    imageInput.addEventListener('change', async (e) => {
      const selectedFiles = e.target.files;
      previewContainer.classList.remove('hidden');
      // Önce önizleme konteynerini temizleyin
      // previewContainer.innerHTML = '';
      // Her seçilen dosya için yeni bir önizleme oluşturun
      for (let i = 0; i < selectedFiles.length; i++) {
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

              const previewList = deleteButton.closest('.preview-list');
              const presentPreviewLists = document.querySelectorAll(
                '.preview-list--present',
              );
              let index;
              if (presentPreviewLists.length !== 0) {
                index =
                  Array.from(previewList.parentElement.children).indexOf(
                    previewList,
                  ) - presentPreviewLists.length;
              } else {
                index = Array.from(previewList.parentElement.children).indexOf(
                  previewList,
                );
              }
              // İlgili dosyayı seçimden kaldır
              const imageInput = document.querySelector(`.input--${key}`);
              const selectedFiles = Array.from(imageInput.files);

              selectedFiles.splice(index, 1); // Seçili dosyayı diziden kaldır
              if (selectedFiles.length + presentPreviewLists.length === 0) {
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

  const imageDeletes = document.querySelectorAll('.preview-delete-edit');

  imageDeletes.forEach((image) => {
    image.addEventListener('click', async function (e) {
      e.preventDefault();
      e.stopPropagation();

      const imageDeleted = this.dataset.image;
      const previewList = this.closest('.preview-list');
      const previewContainer = this.closest('.preview-container');
      const multipleImageBox =
        this.closest('.content-box').querySelector('.image-box');

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
            const response = await axios.get(
              `${BASE_URL}/api/v1/tours/${id}`,
            );
            const data = {
              images: response.data.data.data.images,
              imageDeleted: imageDeleted,
            };
            const res = await axios.patch(
              `${BASE_URL}/api/v1/tours/${id}/image`,
              data,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
              },
            );
            if (res.status === 200 || res.status === 204) {
              previewList.remove();
              multipleImageBox.setAttribute(
                'data-value',
                multipleImageBox
                  .getAttribute('data-value')
                  .split(',')
                  .filter((item) => item !== imageDeleted)
                  .join(','),
              );
              if (!previewContainer.querySelector('.preview-list')) {
                previewContainer.classList.add('hidden');
              }
              showAlert('success', 'The image has successfully deleted');
            } else {
              showAlert('error', 'An error occurred while deleting the image.');
            }
          } catch (err) {
            // console.error(err);
            // showAlert('error', 'Deletion Failed');

            if (err.response && err.response.data) {
              console.log('err.response.data', err.response.data);
              showAlert('error', err.response.data.message);
            } else {
              console.log('err', err);
              showAlert('error', 'An error occurred while deleting the image.');
            }
          }
        }
      });
    });
  });
});

$('.select-list').select2({
  width: '100%',
});

$('.select-list-multiple').select2({
  width: '100%',
});
// const selectedGuideIds = guides.map(guide => guide._id);
// $('.select-list-multiple').val(selectedGuideIds);
// $('.select-list-multiple').trigger('change');

// // const elements = document.querySelectorAll('input, a[href="#next"][role="menuitem"]');
// const elements = document.querySelectorAll('.input-text, .ck-editor__main, .select2-selection', 'a[href="#next"]');

//////////////////////////////////////
// *** CK EDITOR

let editor1;
let editor2;

ClassicEditor.create(document.querySelector('#editor1'))
  .then((editor) => {
    editor1 = editor;
    const textarea = document.querySelector('textarea.editor1');
    document
      .querySelector('label[for=editor1')
      .addEventListener('click', function () {
        editor.focus();
      });
    editor.setData(decodeEntities(textarea.innerHTML));
    editor1.model.document.on('change:data', () => {
      const editorData = editor1.getData();
      // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
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
    const textarea = document.querySelector('textarea.editor2');
    document
      .querySelector('label[for=editor2')
      .addEventListener('click', function () {
        editor.focus();
      });
    editor.setData(decodeEntities(textarea.innerHTML));
    editor2.model.document.on('change:data', () => {
      const editorData = editor2.getData();
      // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
      // const textarea = document.querySelector(
      //   'textarea.editor2[name="description"]',
      // );
      const strippedText = editorData.replace(/(<([^>]+)>)/gi, '').trim();
      textarea.value = strippedText;
    });
  })
  .catch((error) => {
    console.error(error);
  });
