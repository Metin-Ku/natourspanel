const User = require('../../models/userModel');
const Role = require('../../models/roleModel');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const user = await User.find();
  
  res.status(200).render('Admin/User/list', {
    title: 'User List',
    user,
    javascript: ['Admin/js/index.js', 'Admin/js/user/list.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/datatables.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/nouislider.min.js',
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

exports.getUserAdd = catchAsync(async (req, res) => {
  const roles = await Role.find();

  res.status(200).render('Admin/User/add', {
    title: 'Add User',
    roles,
    javascript: ['Admin/js/index.js', 'Admin/js/user/add.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
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

exports.getUserEdit = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  const roles = await Role.find();
  console.log(user);
  res.status(200).render('Admin/User/edit', {
    title: 'Edit User',
    user,
    roles,
    javascript: ['Admin/js/index.js', 'Admin/js/user/edit.js'],
    scripts: [
      'Admin/js/libraries/jquery.min.js',
      'Admin/js/libraries/jquery.steps.min.js',
      'Admin/js/libraries/validate.min.js',
      'Admin/js/libraries/axios.min.js',
      'Admin/js/libraries/sweetalert2.min.js',
      'Admin/js/libraries/select2.min.js',
      'Admin/js/libraries/jquery.validate.min.js',
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
