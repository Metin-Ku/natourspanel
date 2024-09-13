const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// *** kullanıcı'nın fotoğraf eklemesi
exports.uploadUserPhoto = upload.single('photo');

// resim memorydeyken fotoğrafı boyutlandırma
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // *** görseli veri tabanına kaydetmek için filename tanımlanıyor daha sonra updateMe'ye next ile taşınacak
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // admin panelden kullanıcı yaratırken fotoğraf eklemek için
  req.body.photo = req.file.filename;

  const photo = await User.findById(req.params.id).select('photo');
  if (photo) {
    fs.unlink(`public/img/users/original/${photo.photo}`, () => {});
    fs.unlink(`public/img/users/thumb/${photo.photo}`, () => {});
  }

  // görseli kırpma
  await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/original/${req.file.filename}`);
  await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/thumb/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// ID coming from the currently logged in user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  // aslında silmiyor inaktif hale getiriyor ki ilerde kullanıcı tekrar aktif hale getirebilsin
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use / updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // *** fotoğraf'ın ismini veritabanına yazma
  if (req.file) filteredBody.photo = req.file.filename;
  // filteredBody değeri sadece update edilmesi istenin body partları olmalı
  // filteredBody yerine req.body yapsak user'lar role değerlerinide değiştirebilirdi
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = factory.createOne(User);
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do NOT update passwords with this
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
