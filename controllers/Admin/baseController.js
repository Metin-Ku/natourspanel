exports.getOverview = (req, res) => {
  res.status(200).render('Admin/base', {
    title: 'Your account',
    javascript: ['Admin/js/index.js'],
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
      'Admin/css/libraries/select2.min.css',
      'Admin/css/libraries/sweetalert2.min.css',
    ],
  });
};
