/* eslint-disable */

///////////////////////////////////////////
// *** ADD

const wizard = document.querySelector('.wizard');

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

        const checkbox = document.querySelector('#active');
        const checked = checkbox.checked;
        if (!checked) formData.append('active', 'false');

        // formData.forEach((value, key) => {
        //   console.log(key, value);
        // });
        // if (true) return;
        const validated = handleFormSubmit(form);

        if (!validated) {
          showAlert('error', 'Please fill in the required fields.');
          return;
        }

        addUser(formData);
      }
    },
  });
}

let constraints = {};

document
  .querySelectorAll('#dataForm [data-required="required"]')
  .forEach((inputElement) => {
    const name = inputElement.getAttribute('name');
    const type = inputElement.getAttribute('type');
    if (name) {
      constraints[name] = {
        presence: true,
        email: type == 'email' ? true : false,
        equality:
          type == 'password'
            ? {
                attribute: 'password',
                message: '^The passwords does not match',
              }
            : false,
      };
    }
  });

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

    // flatpickr('.datepicker', {
    //   onChange: function (selectedDates, dateStr, instance) {
    //     const errors = validate(form, constraints) || {};
    //     // console.log(instance.element);
    //     showErrorsForInput(instance.element, errors[instance.element.name]);
    //   },
    // });
  }

  addToInputs();
});

function handleFormSubmit(form, input) {
  // validate the form against the constraints
  const errors = validate(form, constraints, { format: 'detailed' });
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

function checkMaxLength(value, maxLength, inputName, type) {
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

function checkMinLength(value, minLength, inputName, type) {
  if (value.length < minLength) {
    if (type == 'file') {
      showAlert(
        'error',
        `${inputName} is too few (minimum size: ${minLength} files).`,
      );
    } else {
      showAlert(
        'error',
        `${inputName} is too short (minimum length: ${minLength} characters).`,
      );
    }
    return true; // Eğer bir hata constsa true döndür
  }
  return false; // Eğer bir hata yoksa false döndür
}

const addUser = async (data) => {
  try {
    const maxInputs = document.querySelectorAll('input[data-max-length]');
    const minInputs = document.querySelectorAll('input[data-min-length]');
    let hasError = false; // Hata kontrolü için

    for (const input of maxInputs) {
      const name = input.getAttribute('name');
      const label = document.querySelector(`label[for="${name}"]`);
      const labelText = label.textContent.trim();
      const maxLen = parseInt(input.getAttribute('data-max-length'), 10);
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
      if (checkMaxLength(value, maxLen, labelText, type)) {
        hasError = true;
      }
    }

    for (const input of minInputs) {
      const name = input.getAttribute('name');
      const label = document.querySelector(`label[for="${name}"]`);
      const labelText = label.textContent.trim();
      const minLen = parseInt(input.getAttribute('data-min-length'), 10);
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
      if (checkMinLength(value, minLen, labelText, type)) {
        hasError = true;
      }
    }

    if (hasError) return; // Hata constsa işlemi sonlandır. Bu olmasa post işlemi gerçekleşir ver veriler null olduğu için 500 hatası verirdi.

    const url = `${BASE_URL}/api/v1/users`;

    const res = await axios({
      method: 'POST',
      url,
      data,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'User added successfully!');
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    if (err.response && err.response.data) {
      console.log('err.response.data', err.response.data);
      if (err.response.data.error.code === 11000)
        showAlert('error', 'This email address is already in use.');
    } else {
      console.log('err', err);
      showAlert('error', 'An error occurred while adding the user.');
    }
  }
};

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

  imageInput.addEventListener('change', async (e) => {
    const selectedFiles = e.target.files;
    previewContainer.classList.remove('hidden');
    // Önce önizleme konteynerini temizleyin
    previewContainer.innerHTML = '';
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

            // Önce önizlemeyi kaldır

            const previewList = deleteButton.closest('.preview-list');

            const index = Array.from(
              previewList.parentElement.children,
            ).indexOf(previewList);
            // İlgili dosyayı seçimden kaldır
            const imageInput = document.querySelector(`.input--${key}`);
            const selectedFiles = Array.from(imageInput.files);
            selectedFiles.splice(index, 1); // Seçili dosyayı diziden kaldır
            console.log(selectedFiles.length);
            if (selectedFiles.length === 0) {
              if (errors[imageInput.name]) {
                imageBox.classList.remove('border-success-dashed');
                imageUpload.classList.remove('image-upload--success');
                imageBox.classList.add('border-danger-dashed');
                imageUpload.classList.add('image-upload--danger');
              }
              previewContainer.classList.add('hidden');
            } else {
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
const image = document.querySelector('#photo');

imageBoxFirst.addEventListener('click', () => {
  image.click();
});
imageUpload(image, imageBoxFirst, 1);

$('.select-list').select2({
  width: '100%',
});

$('.select-list-multiple').select2({
  width: '100%',
});

//////////////////////////////////////
// *** CK EDITOR

// let editor1;
// let editor2;

// ClassicEditor.create(document.querySelector('#editor1'))
//   .then((editor) => {
//     editor1 = editor;
//     editor1.model.document.on('change:data', () => {
//       const editorData = editor1.getData();
//       // const editorData = viewToPlainText(editor1.editing.view.document.getRoot());
//       const textarea = document.querySelector(
//         'textarea.editor1[name="summary"]',
//       );
//       const strippedText = editorData.replace(/(<([^>]+)>)/gi, '').trim();
//       textarea.value = strippedText;
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// ClassicEditor.create(document.querySelector('#editor2'))
//   .then((editor) => {
//     editor2 = editor;
//     editor2.model.document.on('change:data', () => {
//       const editorData = editor2.getData();
//       const textarea = document.querySelector(
//         'textarea.editor2[name="description"]',
//       );
//       const strippedText = editorData.replace(/(<([^>]+)>)/gi, '').trim();
//       textarea.value = strippedText;
//     });
//   })
//   .catch((error) => {
//     console.error(error);
//   });
