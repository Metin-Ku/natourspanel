const Tour = require('../../models/tourModel');
const ImageSize = require('../../models/imageSizeModel');
const Difficulty = require('../../models/difficultyModel');
const User = require('../../models/userModel');
const catchAsync = require('../../utils/catchAsync');

exports.getAllTours = catchAsync(async (req, res) => {
  // const tours = await Tour.find();
  const difficulties = await Difficulty.find();

  res.status(200).render('Admin/Tour/list', {
    title: 'Tour List',
    difficulties,
    javascript: ['Admin/js/index.js', 'Admin/js/tour/list.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/datatables.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/nouislider.min.js',
      'Admin/js/plugins/ckeditor5/build/ckeditor.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/datatables.min.css',
      'Admin/css/libraries/nouislider.min.css',
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
    ],
  });
});

exports.getTourAdd = catchAsync(async (req, res) => {
  const difficulties = await Difficulty.find();
  const guides = await User.find({ role: 'guide' });

  res.status(200).render('Admin/Tour/add', {
    title: 'Add Tour',
    difficulties,
    guides,
    javascript: ['Admin/js/index.js', 'Admin/js/tour/add.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/flatpickr.min.js',
      'Admin/js/plugins/ckeditor5/build/ckeditor.js',
      'Admin/js/libraries/photoswipe.esm.min.js',
      'Admin/js/libraries/photoswipe-lightbox.esm.min.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
      'Admin/css/libraries/flatpickr.min.css',
      'Admin/css/libraries/photoswipe.min.css',
    ],
  });
});

exports.getTourEdit = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  const difficulties = await Difficulty.find();
  
  // const imageCoverSize = await ImageSize.findOne({
  //   name: 'imageCover',
  //   folder: 'tours',
  // }).select('-_id original');

  // const imageSize = await ImageSize.findOne({
  //   name: 'images',
  //   folder: 'tours',
  // }).select('-_id original');

  const guides = await User.find({ role: 'guide' });

  res.status(200).render('Admin/Tour/edit', {
    title: 'Edit Tour',
    tour,
    difficulties,
    guides,
    // imageCoverSize: imageCoverSize.original,
    // imageSize: imageSize.original,
    javascript: ['Admin/js/index.js', 'Admin/js/tour/edit.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/jquery.validate.min.js',
      'Admin/js/libraries/flatpickr.min.js',
      'Admin/js/plugins/ckeditor5/build/ckeditor.js',
      'Admin/js/libraries/photoswipe.esm.min.js',
      'Admin/js/libraries/photoswipe-lightbox.esm.min.js',
    ],
    css: 'Admin/css/style.css',
    styles: [
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
      'Admin/css/libraries/flatpickr.min.css',
      'Admin/css/libraries/photoswipe.min.css',
    ],
  });
});
