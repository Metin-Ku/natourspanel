const Slider = require('../../models/sliderModel');
// const ImageSize = require('../../models/imageSizeModel');
const catchAsync = require('../../utils/catchAsync');

exports.getAllSliders = catchAsync(async (req, res) => {
  const sliders = await Slider.find();

  res.status(200).render('Admin/Slider/list', {
    title: 'Slider List',
    sliders,
    javascript: ['Admin/js/index.js', 'Admin/js/slider/list.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/datatables.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/datatables.min.css',
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
    ],
  });
});

exports.getSliderAdd = catchAsync(async (req, res) => {
  const sliders = await Slider.find();

  res.status(200).render('Admin/Slider/add', {
    title: 'Add Slider',
    sliders,
    javascript: ['Admin/js/index.js', 'Admin/js/slider/add.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/photoswipe.esm.min.js',
      'Admin/js/libraries/photoswipe-lightbox.esm.min.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
      'Admin/css/libraries/photoswipe.min.css',
    ],
  });
});

exports.getSliderEdit = catchAsync(async (req, res, next) => {
  const slider = await Slider.findById(req.params.id);

  res.status(200).render('Admin/Slider/edit', {
    title: 'Edit Slider',
    slider,
    javascript: ['Admin/js/index.js', 'Admin/js/slider/edit.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/jquery.validate.min.js',
      'Admin/js/libraries/photoswipe.esm.min.js',
      'Admin/js/libraries/photoswipe-lightbox.esm.min.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/sweetalert2.min.css',
      'Admin/css/libraries/photoswipe.min.css',
    ],
  });
});
